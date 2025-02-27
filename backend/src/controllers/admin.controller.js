import db from "../db/index.js";
import { asyncHandler } from "../utils/asyncHaldler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { MailtrapClient } from "mailtrap";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const options = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  path:"/",
};

const dbQuery = async (query, params) => {
  try {
    const [results] = await db.promise().query(query, params);
    return results;
  } catch (error) {
    throw new ApiError(500, "Database Error");
  }
};

const addDets = asyncHandler(async (req, res, next) => {
  const { base, percentPerUnit, totalTaxPercent, tax, state, provider } =
    req.body;

  if (!base || !percentPerUnit || !totalTaxPercent || !tax || !state) {
    return next(new ApiError(400, "All fields are required"));
  }

  try {
    const [existingDetails] = await db
      .promise()
      .query("SELECT * FROM bill_details WHERE state=?", [state]);

    if (existingDetails.length > 0) {
      return next(new ApiError(400, "Details Already Exist"));
    }

    const insertQuery = `
      INSERT INTO bill_details (base, percentPerUnit, totalTaxPercent, tax, state) 
      VALUES (?, ?, ?, ?, ?)
    `;
    const insertParams = [base, percentPerUnit, totalTaxPercent, tax, state];

    await db.promise().query(insertQuery, insertParams);

    return res
      .status(200)
      .json(new ApiResponse(200, state, "Details Added Successfully"));
  } catch (err) {
    return next(new ApiError(500, "Database Error"));
  }
});

const addRangeDets = asyncHandler(async (req, res, next) => {
  const { unitRange, cost, taxPerUnit, state } = req.body;

  if (!unitRange || !cost || !taxPerUnit || !state) {
    return next(new ApiError(400, "All fields are required"));
  }

  try {
    const insertQuery = `
      INSERT INTO cost_per_unit (unitRange, cost, taxPerUnit, state) 
      VALUES (?, ?, ?, ?)
    `;
    const insertParams = [unitRange, cost, taxPerUnit, state];

    await db.promise().query(insertQuery, insertParams);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { unitRange, cost, taxPerUnit, state },
          "Details Added Successfully"
        )
      );
  } catch (err) {
    return next(new ApiError(500, "Database Error"));
  }
});

const getDets = asyncHandler(async (req, res, next) => {
  const { role } = req?.user;
  const isClient = role === "Client";
  const { state } = req.query;

  if (isClient && !state) {
    return next(new ApiError(400, "State is required"));
  }

  if (isClient) {
    try {
      const billDetailsQuery = "SELECT * FROM bill_details WHERE state=?";
      const [billDetails] = await db.promise().query(billDetailsQuery, [state]);

      if (!billDetails || billDetails.length === 0) {
        return next(new ApiError(404, "No Bill Details Found"));
      }

      const costDetailsQuery = "SELECT * FROM cost_per_unit WHERE state=?";
      const [costDetails] = await db.promise().query(costDetailsQuery, [state]);

      if (!costDetails || costDetails.length === 0) {
        return next(new ApiError(404, "No Cost Details Found"));
      }

      const responseData = { billDetails: billDetails[0], costDetails };

      return res
        .status(200)
        .json(
          new ApiResponse(200, responseData, "Data retrieved successfully")
        );
    } catch (err) {
      return next(new ApiError(500, "Database Error"));
    }
  } else {
    try {
      const billDetailsQuery = "SELECT * FROM bill_details";
      const [billDetails] = await db.promise().query(billDetailsQuery);

      if (!billDetails || billDetails.length === 0) {
        return next(new ApiError(404, "No Bill Details Found"));
      }

      const costDetailsQuery = "SELECT * FROM cost_per_unit";
      const [costDetails] = await db.promise().query(costDetailsQuery);

      if (!costDetails || costDetails.length === 0) {
        return next(new ApiError(404, "No Cost Details Found"));
      }

      const responseData = { billDetails, costDetails };

      return res
        .status(200)
        .json(
          new ApiResponse(200, responseData, "Data retrieved successfully")
        );
    } catch (err) {
      return next(new ApiError(500, "Database Error"));
    }
  }
});

const generateToken = (user) => {
  const payload = {
    id: user.phoneno,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};

const register = asyncHandler(async (req, res, next) => {
  let { name, password, email, phoneno, role } = req.body;

  console.log("Request body:", req.body);

  name = name.trim();
  email = email.trim();
  phoneno = phoneno.trim();
  role = role.trim();

  if (!name || !password || !email || !role) {
    return next(new ApiError(400, "All fields are required"));
  }

  const trimmedPassword = password.trim();
  if (!trimmedPassword) {
    return next(new ApiError(400, "Enter a valid password"));
  }

  if (phoneno.length !== 10 || isNaN(phoneno)) {
    return next(new ApiError(400, "Enter a valid phone number"));
  }

  const validRoles = ["Client", "Admin"];
  if (!validRoles.includes(role)) {
    console.log("Invalid role entered");
    return next(new ApiError(400, "Invalid role"));
  }

  try {
    const hashPassword = await bcrypt.hash(trimmedPassword, 10);
    console.log("Hashed password successfully");

    const [userResult] = await db
      .promise()
      .query(
        "INSERT INTO users (phoneno, name, password, email, role) VALUES (?, ?, ?, ?, ?)",
        [phoneno, name, hashPassword, email, role]
      );

    if (userResult.affectedRows === 0) {
      return next(new ApiError(500, "User registration failed"));
    }

    const user = { id: phoneno, email, name };

    if (role === "Client") {
      await db
        .promise()
        .query(
          "INSERT INTO client_dets (phoneno, state, MACadd) VALUES (?, ?, ?)",
          [phoneno, null, null]
        );
    }
    return res
      .status(200)
      .json(new ApiResponse(200, user, "User Registered Successfully"));
  } catch (err) {
    console.error("Database error:", err);
    return next(new ApiError(500, "Database Error"));
  }
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password, role } = req.body;
  console.log("Request body:", req.body);
  try {
    const user = await dbQuery(
      "SELECT * FROM users WHERE email = ? AND role = ?",
      [email, role]
    );

    if (user.length === 0) {
      return next(new ApiError(401, "Invalid credentials: User not found"));
    }

    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return next(new ApiError(401, "Invalid credentials: Incorrect password"));
    }

    const token = generateToken(user[0]);

    console.log("User logged in successfully:", user[0].email);
    res.cookie("authToken", token, options);
    return res
      .status(200)
      .json(
        new ApiResponse(200, { ...user[0],token}, "Successfully logged in")
      );
  } catch (err) {
    if (err.code === "ER_BAD_DB_ERROR") {
      return next(new ApiError(500, "Database connection error"));
    }

    if (err.code === "ER_PARSE_ERROR") {
      return next(new ApiError(500, "Error parsing the query"));
    }

    return next(new ApiError(500, "An unexpected error occurred during login"));
  }
});

const googleLogin = asyncHandler(async (req, res, next) => {
  const { token } = req.body;

  try {
    const decoded = jwt.decode(token, { complete: true });
    const { name, email } = decoded.payload;

    const user = await dbQuery("SELECT * FROM users WHERE email = ?", [email]);

    if (user.length > 0) {
      const { phoneno, role } = user[0];
      const token = generateToken(user[0]);

      res.cookie("authToken", token, options);
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { email, name, phoneno, role, token },
            "Successfully logged in"
          )
        );
    } else {
      await dbQuery(
        "INSERT INTO users (phoneno, name, email) VALUES (?, ?, ?)",
        [0, name, email]
      );
      return res
        .status(201)
        .json(
          new ApiResponse(
            201,
            { email, name },
            "Successfully registered. Add phone number"
          )
        );
    }
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(new ApiError(400, "Invalid token"));
    }
    return next(new ApiError(500, "Google login error"));
  }
});

const addPhoneno = asyncHandler(async (req, res, next) => {
  const { email, phone, role, name } = req.body;

  console.log("Received data:", { email, phone, role });

  // Check for missing required fields
  if (!email || !phone || !role || !name) {
    console.log("Missing required fields");
    return next(new ApiError(400, "All fields are required"));
  }

  // Validate phone number (assuming a 10-digit phone number)
  if (phone.length !== 10 || isNaN(phone)) {
    console.log("Invalid phone number");
    return next(new ApiError(400, "Enter a valid phone number"));
  }

  // Validate role (only certain roles allowed)
  const validRoles = ["Admin", "Client"]; // Adjust this list based on your needs
  if (!validRoles.includes(role)) {
    console.log("Invalid role provided");
    return next(new ApiError(400, "Invalid role"));
  }

  try {
    // Update the phone number and role for the user in 'users' table
    await db
      .promise()
      .query(`UPDATE users SET phoneno = ?, role=? WHERE email = ?`, [
        phone,
        role,
        email,
      ]);

    console.log("Phone number updated successfully for user:", email);

    // If the user is a client, insert into 'client_dets' table
    if (role === "Client") {
      console.log("Inserting client details into client_dets table");
      await db.promise().query(
        `INSERT INTO client_dets (phoneno, state) VALUES (?, ?)`,
        [phone, null] // Assuming `state` is null initially
      );
    }

    // Generate token and set it in the cookie
    const user = { id: phone, email, name, role };
    const token = generateToken(user);

    const options = {
      httpOnly: true, // Ensure the cookie is only accessible via HTTP (not JS)
      secure: process.env.NODE_ENV === "production", // Only set secure cookies in production
      maxAge: 3600000, // 1 hour
    };

    console.log("Setting auth token in cookie");

    res.cookie("authToken", token, options);

    return res
      .status(200)
      .json(new ApiResponse(200, { user }, "Registered successfully"));
  } catch (err) {
    console.error("Error during database update:", err);
    return next(new ApiError(500, "Database Error"));
  }
});

const update = asyncHandler(async (req, res, next) => {
  const { name, email } = req.body;
  const user = req?.user;

  if (!user) {
    return next(new ApiError(400, "User not authenticated"));
  }

  if (!name || !email) {
    return next(new ApiError(400, "Name and email are required"));
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return next(new ApiError(400, "Invalid email format"));
  }

  console.log("Updating user details for phoneno:", user.id);

  try {
    const [existingUser] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ? AND phoneno != ?", [
        email,
        user.id,
      ]);

    if (existingUser.length > 0) {
      return next(new ApiError(400, "Email is already in use"));
    }

    const [result] = await db
      .promise()
      .query("UPDATE users SET name=?, email=? WHERE phoneno=?", [
        name,
        email,
        user.id,
      ]);

    if (result.affectedRows === 0) {
      return next(new ApiError(404, "User not found"));
    }

    console.log("User updated successfully:", { name, email });

    return res
      .status(200)
      .json(new ApiResponse(200, result, "Updated Successfully"));
  } catch (error) {
    console.error("Update error:", error);
    return next(new ApiError(500, "Server error"));
  }
});

const getClientDets = asyncHandler(async (req, res, next) => {
  const query = `
    SELECT u.phoneno, u.name, u.email, u.role,c.MACadd, c.voltage, c.current, c.watt, c.date_time, c.state
    FROM users u
    JOIN client_dets c ON u.phoneno = c.phoneno
    WHERE u.role = 'Client'
  `;

  try {
    const [result] = await db.promise().query(query);

    if (result.length === 0) {
      console.log("No client users found.");
      return res
        .status(200)
        .json(new ApiResponse(200, [], "No Client Users Found"));
    }

    console.log("User and client details fetched successfully");
    return res
      .status(200)
      .json(new ApiResponse(200, result, "Data Retrieved Successfully"));
  } catch (err) {
    console.error("Error fetching client details:", err.message);
    return next(new ApiError(500, "Database Error"));
  }
});

const updateBilldets = asyncHandler(async (req, res, next) => {
  const {
    base,
    percentPerUnit,
    totalTaxPercent,
    tax,
    state,
    unitRanges,
    costs,
  } = req.body;

  console.log(base, percentPerUnit, totalTaxPercent, tax, costs, unitRanges);

  const updateQuery =
    "UPDATE bill_details SET base=?, percentPerUnit=?, totalTaxPercent=?, tax=? WHERE state=?";
  const updateParams = [base, percentPerUnit, totalTaxPercent, tax, state];

  try {
    const [updateResult] = await db.promise().query(updateQuery, updateParams);

    if (updateResult.affectedRows === 0) {
      return next(new ApiError(500, "No rows updated in bill_details"));
    }

    let updateMessage = "Updated Successfully";

    if (unitRanges && costs) {
      await db.promise().query("START TRANSACTION");

      const promises = unitRanges.map((unitRange, index) => {
        return db
          .promise()
          .query(
            `UPDATE cost_per_unit SET cost=? WHERE unitRange=? AND state=?`,
            [costs[index], unitRange, state]
          );
      });

      try {
        await Promise.all(promises);
        await db.promise().query("COMMIT");
        console.log("Transaction committed successfully");

        updateMessage = "Bill details and cost details updated successfully";
      } catch (transactionError) {
        console.error("Error during cost update:", transactionError);
        await db.promise().query("ROLLBACK");
        return next(new ApiError(500, "Error updating cost details"));
      }
    }

    return res.status(200).json(new ApiResponse(200, updateMessage));
  } catch (err) {
    console.error("Error updating bill details:", err);
    await db.promise().query("ROLLBACK");
    return next(new ApiError(500, "Database Error"));
  }
});

const updateProfile = asyncHandler(async (req, res, next) => {
  const profilePath = req?.file?.path;
  const user = req?.user;

  try {
    console.log(res);
    console.log(profilePath);
    const profile = await uploadOnCloudinary(profilePath);
    console.log(profile);
    const updateQuery = `
      UPDATE users SET
        profile=?
      WHERE phoneno = ?
    `;
    const updateParams = [profile.secure_url, user.id];

    console.log("Executing update query...");
    const [updateResult] = await db.promise().query(updateQuery, updateParams);

    if (updateResult.affectedRows === 0) {
      console.log("No rows affected, client data update failed.");
      return next(new ApiError(404, "No matching client found"));
    }

    console.log("Client data updated successfully.");
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          profile.secure_url,
          "Client data updated successfully"
        )
      );
  } catch (err) {
    console.error("Database error:", err);
    return next(new ApiError(500, "Database error"));
  }
});

export {
  addDets,
  addRangeDets,
  getDets,
  register,
  login,
  googleLogin,
  addPhoneno,
  update,
  getClientDets,
  updateBilldets,
  updateProfile,

};
