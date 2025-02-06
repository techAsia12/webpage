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
  const { base, percentPerUnit, totalTaxPercent, tax, state, provider } = req.body;

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

  try {
    // Fetching bill details based on state (for both clients and non-clients)
    const billDetailsQuery = isClient
      ? "SELECT * FROM bill_details WHERE state=?"
      : "SELECT * FROM bill_details";
    const [billDetails] = await db.promise().query(billDetailsQuery, isClient ? [state] : []);

    if (!billDetails || billDetails.length === 0) {
      return next(new ApiError(404, "No Bill Details Found"));
    }

    // Fetching cost details (for both clients and non-clients)
    const costDetailsQuery = isClient
      ? "SELECT * FROM cost_per_unit WHERE state=?"
      : "SELECT * FROM cost_per_unit";
    const [costDetails] = await db.promise().query(costDetailsQuery, isClient ? [state] : []);

    if (!costDetails || costDetails.length === 0) {
      return next(new ApiError(404, "No Cost Details Found"));
    }

    // Construct the response data based on the role (Client or Admin)
    const responseData = isClient
      ? { billDetails: billDetails[0], costDetails }
      : { billDetails, costDetails };

    return res.status(200).json(
      new ApiResponse(200, responseData, "Data retrieved successfully")
    );
  } catch (err) {
    console.error("Error retrieving data:", err);
    return next(new ApiError(500, "Database Error"));
  }
});

const generateToken = (user) => {
  const payload = {
    id: user.phoneno,
    role: user.role,
  };

  // Ensure JWT_SECRET and JWT_EXPIRATION are present
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  if (!process.env.JWT_EXPIRATION) {
    throw new Error("JWT_EXPIRATION is not defined in environment variables");
  }

  try {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });
  } catch (err) {
    console.error("Error generating JWT:", err);
    throw new Error("Error generating JWT token");
  }
};

const register = asyncHandler(async (req, res, next) => {
  let { name, password, email, phoneno, role } = req.body;

  console.log("Request body:", req.body);

  // Trim fields to remove unwanted spaces
  name = name.trim();
  email = email.trim();
  phoneno = phoneno.trim();
  role = role.trim();

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

  // Validate role
  const validRoles = ['Client', 'Admin']; // Example roles, adjust as needed
  if (!validRoles.includes(role)) {
    console.log("Invalid role entered");
    return next(new ApiError(400, "Invalid role"));
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
    // Query user based on email and role
    const [result] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ? AND role = ?", [email, role]);

    if (result.length === 0) {
      console.log("Invalid credentials attempt (email/role mismatch).");
      return next(new ApiError(402, "Invalid Credentials"));
    }

    const user = result[0];

    // Check password match
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password comparison result:", isMatch);
    if (!isMatch) {
      console.log("Password mismatch for user with email:", email);
      return next(new ApiError(403, "Invalid Email or Password"));
    }

    // Generate token
    const token = generateToken(user);
    console.log("Generated token for user:", user.phoneno);  // Do not log the full token

    // Cookie options
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',  // Only set secure cookies in production
      maxAge: 3600000,  // 1 hour
    };

    // Set auth token in cookies
    console.log("Setting auth token in cookies");
    res.cookie("authToken", token, options);

    // Exclude password and other sensitive data from response
    const { password: _, ...userData } = user;

    return res.status(200).json(
      new ApiResponse(200, { ...userData, token }, "Successfully logged in")
    );
  } catch (err) {
    console.error("Error in login:", err);
    return next(new ApiError(500, "Database Error"));
  }
});

const googleLogin = asyncHandler(async (req, res, next) => {
  try {
    const { token } = req.body;
    console.log("Received token:", token);

    // Use jwt.verify instead of decode to verify the token's authenticity
    const decoded = jwt.verify(token, process.env.GOOGLE_CLIENT_SECRET);
    console.log("Decoded Token:", decoded);

    const { name, email } = decoded;

    console.log("User details - Name:", name, "Email:", email);

    const [userResult] = await db
      .promise()
      .query("SELECT * FROM users WHERE email=?", [email]);

    if (userResult.length > 0) {
      console.log("User found in the database. Logging in.");
      const { phoneno, name, role } = userResult[0];
      const user = { email, name, phoneno, role };
      const token = generateToken(user);

      // Set cookie options securely
      const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',  // Only set secure cookies in production
        maxAge: 3600000,  // 1 hour
      };

      console.log("Generated token, setting auth token in cookies");

      res.cookie("authToken", token, options);

      return res.status(200).json(
        new ApiResponse(200, { ...user, token }, "Successfully logged in")
      );
    } else {
      console.log("User not found in the database. Registering.");

      // Instead of setting phoneno to 0, prompt for the phone number (validation needed)
      return res.status(201).json(
        new ApiResponse(
          201,
          { email, name },
          "Successfully registered. Add your phone number."
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
  const validRoles = ['Admin', 'Client'];  // Adjust this list based on your needs
  if (!validRoles.includes(role)) {
    console.log("Invalid role provided");
    return next(new ApiError(400, "Invalid role"));
  }

  try {
    // Update the phone number and role for the user in 'users' table
    await db.promise().query(`UPDATE users SET phoneno = ?, role=? WHERE email = ?`, [
      phone,
      role,
      email,
    ]);

    console.log("Phone number updated successfully for user:", email);

    // If the user is a client, insert into 'client_dets' table
    if (role === 'Client') {
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
      secure: process.env.NODE_ENV === 'production', // Only set secure cookies in production
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

  // Validate required fields
  if (!name || !email) {
    return next(new ApiError(400, "Name and email are required"));
  }

  // Validate email format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return next(new ApiError(400, "Invalid email format"));
  }

  console.log("Updating user details for phoneno:", user.id);

  try {
    // Check if the new email already exists
    const [existingUser] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ? AND phoneno != ?", [
        email,
        user.id,
      ]);

    if (existingUser.length > 0) {
      return next(new ApiError(400, "Email is already in use"));
    }

    // Perform the update
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

const sendMail = asyncHandler(async (req, res, next) => {
  const { email } = req.query;

  console.log(`Received request to send verification email to: ${email}`);

  // Fetch the token securely from environment variables
  const TOKEN = process.env.MAILTRAP_API_TOKEN;

  // Initialize the Mailtrap client with a secure token
  const client = new MailtrapClient({
    endpoint: "https://send.api.mailtrap.io/",
    token: TOKEN, // Use the environment variable for the token
  });

  const verificationCode = generateVerificationCode();
  console.log(`Generated verification code: ${verificationCode}`);

  try {
    // Send email using Mailtrap
    await client.send({
      from: { name: "TechAsia", email: "mailtrap@demomailtrap.com" },
      to: [{ email: email }],
      subject: "Password Verification Code",
      text: `Hello,

      We received a request to reset your password. Please use the following code to verify your identity:

      Verification Code: ${verificationCode}

      If you did not request this, please ignore this email.

      Best regards,
      Your Team`,
    });

    console.log(`Email successfully sent to: ${email}`);

    // Store the verification code securely (e.g., in the database, or session store)
    // Assuming a function storeVerificationCode exists:
    await storeVerificationCode(email, verificationCode);

    return res.status(200).json(new ApiResponse(200, { email }, "Email Sent"));
  } catch (error) {
    console.error("Error sending email:", error);

    return next(
      new ApiError(400, "Something went wrong while sending mail, please try again")
    );
  }
});

const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Ensure password is provided
  if (!password || password.trim() === "") {
    return next(new ApiError(400, "Password is required"));
  }

  // Validate password length or other criteria
  if (password.length < 8) {
    return next(new ApiError(400, "Password must be at least 8 characters long"));
  }

  const storedPasswordQuery = "SELECT password FROM users WHERE email=?";

  try {
    const [rows] = await db.promise().query(storedPasswordQuery, [email]);

    // Check if user exists
    if (rows.length === 0) {
      return next(new ApiError(404, "User not found"));
    }

    const storedPassword = rows[0].password;

    // Check if the new password matches the current password
    const isMatch = await bcrypt.compare(password, storedPassword);

    if (isMatch) {
      return next(new ApiError(400, "New password cannot be the same as the old password"));
    }

    // Hash and update the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const updateQuery = "UPDATE users SET password=? WHERE email=?";
    await db.promise().query(updateQuery, [hashedPassword, email]);

    return res
      .status(200)
      .json(new ApiResponse(200, "Password reset successfully"));

  } catch (err) {
    console.error("Error resetting password:", err);
    return next(new ApiError(500, "An error occurred while resetting the password"));
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
      console.log("No client users found.");
      return res.status(200).json(new ApiResponse(200, [], "No Client Users Found"));
    }

    console.log("User and client details fetched successfully");
    return res.status(200).json(new ApiResponse(200, result, "Data Retrieved Successfully"));
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
  updateBilldets
};
