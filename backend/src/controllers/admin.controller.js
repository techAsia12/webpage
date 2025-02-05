import db from "../db/index.js";
import { asyncHandler } from "../utils/asyncHaldler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { MailtrapClient } from "mailtrap";

const options = {
  httpOnly: true,
  secure: true,
  sameSite: "Strict",
};

const addDets = asyncHandler(async (req, res, next) => {
  const { base, percentPerUnit, totalTaxPercent, tax, state, provider } =
    req.body;

  console.log("Received request body:", req.body);

  if (!base || !percentPerUnit || !totalTaxPercent || !tax || !state) {
    return next(new ApiError(400, "All fields are required"));
  }

  try {
    console.log("Checking if details already exist for state:", state);

    const [existingDetails] = await db
      .promise()
      .query("SELECT * FROM bill_details WHERE state=?", [state]);

    if (existingDetails.length > 0) {
      console.log("Details already exist for state:", state);
      return next(new ApiError(400, "Details Already Exist"));
    }

    console.log("Inserting new details for state:", state);

    const insertQuery = `
      INSERT INTO bill_details (base, percentPerUnit, totalTaxPercent, tax, state) 
      VALUES (?, ?, ?, ?, ?)
    `;
    const insertParams = [base, percentPerUnit, totalTaxPercent, tax, state];

    const [insertResult] = await db.promise().query(insertQuery, insertParams);

    console.log("Details successfully added for state:", state);
    return res
      .status(200)
      .json(new ApiResponse(200, state, "Details Added Successfully"));
  } catch (err) {
    console.error("Database error:", err);
    return next(new ApiError(500, "Database Error"));
  }
});

const addRangeDets = asyncHandler(async (req, res, next) => {
  const { unitRange, cost, taxPerUnit, state } = req.body;

  console.log("Received data:", { unitRange, cost, taxPerUnit, state });

  if (!unitRange || !cost || !taxPerUnit || !state) {
    console.log("Validation failed: Missing required fields.");
    return next(new ApiError(400, "All fields are required"));
  }

  try {
    const insertQuery = `
      INSERT INTO cost_per_unit (unitRange, cost, taxPerUnit, state) 
      VALUES (?, ?, ?, ?)
    `;
    const insertParams = [unitRange, cost, taxPerUnit, state];

    const [insertResult] = await db.promise().query(insertQuery, insertParams);

    console.log("Details added successfully:", {
      unitRange,
      cost,
      taxPerUnit,
      state,
    });
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
    console.error("Error inserting data into the database:", err);
    return next(new ApiError(500, "Database Error"));
  }
});

const getDets = asyncHandler(async (req, res, next) => {
  const isClient = req?.user?.role === "Client";
  if (isClient) {
    const { state } = req.query;

    if (!state) {
      console.error("State parameter is missing.");
      return next(new ApiError(400, "State is required"));
    }

    try {
      console.log(`Fetching bill details for state: ${state}`);
      const billDetailsQuery = "SELECT * FROM bill_details WHERE state=?";
      const [billDetails] = await db.promise().query(billDetailsQuery, [state]);

      if (!billDetails || billDetails.length === 0) {
        console.log(`No bill details found for state: ${state}`);
        return next(new ApiError(404, "No Bill Details Found"));
      }

      console.log("Fetched bill details:", billDetails[0]);

      console.log(`Fetching cost details for state: ${state}`);
      const costDetailsQuery = "SELECT * FROM cost_per_unit WHERE state=?";
      const [costDetails] = await db.promise().query(costDetailsQuery, [state]);

      if (!costDetails || costDetails.length === 0) {
        console.log(`No cost details found for state: ${state}`);
        return next(new ApiError(404, "No Cost Details Found"));
      }

      console.log("Fetched cost details:", costDetails);

      // Prepare the response data based on role
      const responseData = isClient
        ? { billDetails: billDetails[0], costDetails }
        : { billDetails, costDetails };

      return res
        .status(200)
        .json(
          new ApiResponse(200, responseData, "Data retrieved successfully")
        );
    } catch (err) {
      console.error("Error in retrieving data:", err);
      return next(new ApiError(500, "Database Error"));
    }
  } else {
    const billDetailsQuery = "SELECT * FROM bill_details";
    const [billDetails] = await db.promise().query(billDetailsQuery);

    if (!billDetails || billDetails.length === 0) {
      console.log("No bill details found.");
      return next(new ApiError(404, "No Bill Details Found"));
    }

    console.log("Fetched bill details:", billDetails);
    const costDetailsQuery = "SELECT * FROM cost_per_unit";
    const [costDetails] = await db.promise().query(costDetailsQuery);

    if (!costDetails || costDetails.length === 0) {
      console.log("No cost details found.");
      return next(new ApiError(404, "No Cost Details Found"));
    }

    console.log("Fetched cost details:", costDetails);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
           billDetails,
           costDetails,
        },
        "Details Fetched"
      )
    );
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
  const { name, password, email, phoneno, role } = req.body;

  console.log("Request body:", req.body);

  if (!name || !password || !email || !role) {
    console.log("Missing required fields");
    return next(new ApiError(400, "All fields are required"));
  }

  const trimmedPassword = password.trim();
  if (!trimmedPassword) {
    console.log("Invalid password entered");
    return next(new ApiError(400, "Enter a valid password"));
  }

  if (phoneno.length !== 10 || isNaN(phoneno)) {
    console.log("Invalid phone number entered");
    return next(new ApiError(400, "Enter a valid phone number"));
  }

  try {
    const [existingUser] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);

    if (existingUser.length > 0) {
      console.log("Email already in use:", email);
      return next(new ApiError(400, "Email Already in Use"));
    }

    const hashPassword = await bcrypt.hash(trimmedPassword, 10);
    console.log("Hashed password:", hashPassword);

    const [userResult] = await db
      .promise()
      .query(
        "INSERT INTO users (phoneno, name, password, email, role) VALUES (?, ?, ?, ?, ?)",
        [phoneno, name, hashPassword, email, role]
      );

    const user = { id: phoneno, email, name };

    if (role === "Client") {
      await db.promise().query(
        "INSERT INTO client_dets (phoneno, state, MACadd) VALUES (?, ?, ?)",
        [phoneno, null, null] // Assuming `state` is null for now
      );
    }

    console.log("User registered successfully:", user);

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

  console.log("Login attempt:", { email, role });

  try {
    const [result] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ? AND role = ?", [email, role]);

    if (result.length === 0) {
      console.log("No user found with these credentials:", { email, role });
      return next(new ApiError(402, "Invalid Credentials"));
    }

    const user = result[0];

    console.log("User found:", user);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password comparison result:", isMatch);
    if (!isMatch) {
      console.log("Password mismatch for user:", email);
      return next(new ApiError(403, "Invalid Email or Password"));
    }

    const token = generateToken(user);
    console.log("Generated token:", token);

    console.log("Setting auth token in cookies");

    res.cookie("authToken", token, options);

    return res
      .status(200)
      .json(new ApiResponse(200, { ...user, token }, "Successfully logged In"));
  } catch (err) {
    console.error("Database error:", err);
    return next(new ApiError(500, "Database Error"));
  }
});

const googleLogin = asyncHandler(async (req, res, next) => {
  try {
    const { token } = req.body;
    console.log("Received token:", token);

    const decoded = jwt.decode(token, { complete: true });
    console.log("Decoded Token:", decoded);

    const { name, email } = decoded.payload;

    console.log("User details - Name:", name, "Email:", email);

    const [userResult] = await db
      .promise()
      .query(`SELECT * FROM users WHERE email=?`, [email]);

    if (userResult.length > 0) {
      console.log("User found in the database. Logging in.");
      const { phoneno, name, role } = userResult[0];
      const user = { email, name, phoneno, role };
      const token = generateToken(user);

      console.log("Generated token:", token);
      console.log("Setting auth token in cookies");

      res.cookie("authToken", token, options);

      return res
        .status(200)
        .json(
          new ApiResponse(200, { ...user, token }, "Successfully logged In")
        );
    } else {
      console.log("User not found in the database. Registering.");
      await db
        .promise()
        .query(`INSERT INTO users (phoneno, name, email) VALUES (?, ?, ?)`, [
          0,
          name,
          email,
        ]);

      return res
        .status(201)
        .json(
          new ApiResponse(
            201,
            { email, name },
            "Successfully registered. Add phone no."
          )
        );
    }
  } catch (error) {
    console.error("Error during Google login:", error);
    return next(new ApiError(500, "Error during Google login"));
  }
});

const addPhoneno = asyncHandler(async (req, res, next) => {
  const { email, phone, role, name } = req.body;

  console.log("Received data:", { email, phone, role });

  if (!phone || !email || !role) {
    console.log("Missing required fields");
    return next(new ApiError(400, "Missing required fields"));
  }

  try {
    await db
      .promise()
      .query(`UPDATE users SET phoneno = ?, role=? WHERE email = ?`, [
        phone,
        role,
        email,
      ]);

    console.log("Phone number updated successfully for user:", email);

    // Inserting the phone number and state into the 'client_dets' table
    console.log("Inserting client details into client_dets table");
    const user = { id: phone, email, name };
    const token = generateToken(user);

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

  console.log("Updating user details:", { name, email });

  try {
    const [result] = await db
      .promise()
      .query("UPDATE users SET name=?, email=? WHERE phoneno=?", [
        name,
        email,
        user.id,
      ]);

    if (result.affectedRows === 0) {
      return next(new ApiError(404, "Client not found"));
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

const sendMail = asyncHandler(async (req, res, next) => {
  const { email } = req.query;

  console.log(`Received request to send verification email to: ${email}`);
  const TOKEN = process.env.TOKEN;

  const client = new MailtrapClient({
    endpoint: "https://send.api.mailtrap.io/",
    token: "472e8e82d10c7ada7cd1be176daea98d",
  });

  const verificationCode = generateVerificationCode();
  console.log(`Generated verification code: ${verificationCode}`);
  client
    .send({
      from: { name: "TechAsia", email: "mailtrap@demomailtrap.com" },
      to: [{ email: email }],
      subject: "Password Verification Code",
      text: `Hello,

    We received a request to reset your password. Please use the following code to verify your identity:

    Verification Code: ${verificationCode}

    If you did not request this, please ignore this email.

    Best regards,
    Your Team`,
    })
    .then(() => {
      console.log(`Email successfully sent to: ${email}`);

      return res
        .status(200)
        .json(new ApiResponse(200, { verificationCode, email }, "Email Sent"));
    })
    .catch((error) => {
      console.error("Error sending email:", error);

      return next(
        new ApiError(
          400,
          "Something went wrong while sending mail, please try again"
        )
      );
    });
});

const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const storedPasswordQuery = "SELECT password FROM users WHERE email=?";

  try {
    const [rows] = await db.promise().query(storedPasswordQuery, [email]);

    if (rows.length === 0) {
      return next(new ApiError(404, "User not found"));
    }

    const storedPassword = rows[0].password;

    if (storedPassword !== null) {
      const isMatch = await bcrypt.compare(password, storedPassword);

      if (isMatch) {
        return next(
          new ApiError(
            400,
            "New password cannot be the same as the old password"
          )
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const updateQuery = "UPDATE users SET password=? WHERE email=?";
    await db.promise().query(updateQuery, [hashedPassword, email]);

    return res
      .status(200)
      .json(new ApiResponse(200, "Password reset successfully"));
  } catch (err) {
    console.error("Error resetting password:", err);
    return next(
      new ApiError(500, "An error occurred while resetting the password")
    );
  }
});

const getClientDets = asyncHandler(async (req, res, next) => {
  const query = `
    SELECT u.phoneno, u.name, u.email, u.role, c.MACadd, c.voltage, c.current, c.watt, c.date_time, c.state
    FROM users u
    JOIN client_dets c ON u.phoneno = c.phoneno
    WHERE u.role = 'Client'
  `;

  try {
    const [result] = await db.promise().query(query);

    if (result.length === 0) {
      console.log("No User Found");
      return res.status(200).json(new ApiResponse(200, null, "No User Found"));
    }

    console.log("User and client details fetched successfully");
    return res
      .status(200)
      .json(new ApiResponse(200, result, "Data Retrieved Successfully"));
  } catch (err) {
    console.error("Error fetching client details:", err);
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
      return next(new ApiError(500, "Database Error"));
    }

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

      await Promise.all(promises);

      await db.promise().query("COMMIT");
      console.log("Transaction committed successfully");

      return res.status(200).json(new ApiResponse(200, "Updated Successfully"));
    } else {
      return res.status(200).json(new ApiResponse(200, "Updated Successfully"));
    }
  } catch (err) {
    console.error("Error updating bill details:", err);
    await db.promise().query("ROLLBACK");
    return next(new ApiError(500, "Database Error"));
  }
});

export {
  addDets,
  addRangeDets,
  getDets,
  register,
  login,
  sendMail,
  googleLogin,
  addPhoneno,
  update,
  resetPassword,
  getClientDets,
  updateBilldets,
};
