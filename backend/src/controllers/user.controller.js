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
  sameSite: "None",
};

const generateVerificationCode = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

const generateToken = (user) => {
  const payload = {
    id: user.phoneno,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};

const dbQuery = async (query, params) => {
  try {
    const [results] = await db.promise().query(query, params);
    return results;
  } catch (error) {
    throw new ApiError(500, "Database Error");
  }
};

const register = asyncHandler(async (req, res, next) => {
  const { name, password, email, phoneno, state, role } = req.body;

  // Validate required fields
  if (!name || !password || !email || !state || !role) {
    console.log("Validation failed: Missing required fields");
    return next(new ApiError(400, "All fields are required"));
  }

  if (phoneno.length !== 10 || isNaN(phoneno)) {
    console.log("Validation failed: Invalid phone number");
    return next(new ApiError(400, "Enter valid phone number"));
  }

  try {
    // Check if email already exists
    console.log("Checking if email exists: ", email);
    const existingUser = await dbQuery("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (existingUser.length > 0) {
      console.log("Email already in use: ", email);
      return next(new ApiError(400, "Email Already in Use"));
    }
    console.log("Email is available: ", email);

    // Hash password
    console.log("Hashing password for user: ", email);
    const hashPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully");

    // Insert user into 'users' table
    console.log("Inserting user into 'users' table: ", {
      phoneno,
      name,
      email,
      role,
    });
    await dbQuery(
      "INSERT INTO users (phoneno, name, password, email, role) VALUES (?, ?, ?, ?, ?)",
      [phoneno, name, hashPassword, email, role]
    );
    console.log("User inserted into 'users' table successfully");

    // Insert into 'client_dets'
    console.log(
      "Inserting client details into 'client_dets' table for phoneno: ",
      phoneno
    );
    await dbQuery(
      "INSERT INTO client_dets (phoneno, state, MACadd) VALUES (?, ?, ?)",
      [phoneno, state, null]
    );
    console.log("Client details inserted into 'client_dets' successfully");

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { phoneno, email, name },
          "User Registered Successfully"
        )
      );
  } catch (err) {
    console.error("Error during registration: ", err);
    return next(new ApiError(500, "Database Error"));
  }
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password, role } = req.body;

  try {
    const user = await dbQuery(
      "SELECT * FROM users WHERE email = ? AND role = ?",
      [email, role]
    );

    if (user.length === 0) {
      return next(new ApiError(402, "Invalid Credentials"));
    }

    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return next(new ApiError(403, "Invalid Email or Password"));
    }

    const token = generateToken(user[0]);

    res.cookie("authToken", token, options);
    return res
      .status(200)
      .json(
        new ApiResponse(200, { ...user[0], token }, "Successfully logged In")
      );
  } catch (err) {
    return next(new ApiError(500, "Database Error"));
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
            "Successfully logged In"
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
            "Successfully registered add phone no"
          )
        );
    }
  } catch (error) {
    return next(new ApiError(500, "Google login error"));
  }
});

const addPhoneno = asyncHandler(async (req, res, next) => {
  const { email, phone, role, state } = req.body;

  if (!phone || !email || !role || !state) {
    return next(new ApiError(400, "Missing required fields"));
  }

  try {
    await dbQuery("UPDATE users SET phoneno = ?, role = ? WHERE email = ?", [
      phone,
      role,
      email,
    ]);

    if (role === "Client") {
      await dbQuery("INSERT INTO client_dets (phoneno, state) VALUES (?, ?)", [
        phone,
        state,
      ]);
    }

    const token = generateToken({ id: phone, email });
    res.cookie("authToken", token, options);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user: { id: phone, email }, token },
          "Registered successfully"
        )
      );
  } catch (error) {
    return next(new ApiError(500, "Database Error"));
  }
});

const getData = asyncHandler(async (req, res, next) => {
  const user = req?.user;

  if (!user) {
    return next(new ApiError(400, "User not authenticated"));
  }

  console.log("Fetching data for user:", user.id);

  try {
    const [result] = await db
      .promise()
      .query(
        "SELECT phoneno, MACadd, voltage, current, watt, date_time, state FROM client_dets WHERE phoneno = ?",
        [user.id]
      );
    if (result.length === 0) {
      console.log("No data found for user:", user.id);
      return next(new ApiError(404, "No Data Found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, result[0], "Data successfully fetched"));
  } catch (err) {
    console.error("Database error:", err);
    return next(new ApiError(500, "Database Error"));
  }
});

const update = asyncHandler(async (req, res, next) => {
  const { name, email } = req.body;
  const user = req?.user;

  if (!user) {
    return next(new ApiError(400, "User not authenticated"));
  }

  try {
    const result = await dbQuery(
      "UPDATE users SET name=?, email=? WHERE phoneno=?",
      [name, email, user.id]
    );

    return res
      .status(200)
      .json(new ApiResponse(200, result[0], "Updated Successfully"));
  } catch (err) {
    return next(new ApiError(500, "Database Error"));
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

  if (!email || !password) {
    return next(new ApiError(400, "Email and password are required"));
  }

  const storedPasswordQuery = "SELECT password FROM users WHERE email = ?";

  try {
    // Fetch the stored password for the given email
    const [rows] = await db.promise().query(storedPasswordQuery, [email]);

    // Check if user exists
    if (rows.length === 0) {
      return next(new ApiError(404, "User not found"));
    }

    const storedPassword = rows[0].password;

    // Check if the new password is the same as the old password
    const isMatch = await bcrypt.compare(password, storedPassword);
    if (isMatch) {
      return next(
        new ApiError(400, "New password cannot be the same as the old password")
      );
    }

    // Hash the new password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password in the database
    const updateQuery = "UPDATE users SET password = ? WHERE email = ?";
    const updateParams = [hashedPassword, email];
    await db.promise().query(updateQuery, updateParams);

    // Send success response
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

const insertHourly = asyncHandler(async (req, res, next) => {
  const { phoneno, unit } = req.body;
  const currentDate = new Date();

  console.log("Inserting hourly data:", { phoneno, unit });

  try {
    await db
      .promise()
      .query(`INSERT INTO daily_usage (phoneno, unit, time) VALUES (?, ?, ?)`, [
        phoneno,
        unit,
        currentDate,
      ]);

    console.log("Hourly data inserted successfully");

    return res.status(200).json(new ApiResponse(200, "Inserted successfully"));
  } catch (err) {
    console.error("Error inserting hourly data:", err);
    return next(new ApiError(500, "Database Error"));
  }
});

const insertWeekly = asyncHandler(async (req, res, next) => {
  const { phoneno, unit } = req.body;
  const currentDate = new Date();

  console.log("Inserting weekly data:", { phoneno, unit });

  try {
    await db
      .promise()
      .query(
        `INSERT INTO weekly_usage (phoneno, unit, time) VALUES (?, ?, ?)`,
        [phoneno, unit, currentDate]
      );

    console.log("Weekly data inserted successfully");

    return res.status(200).json(new ApiResponse(200, "Inserted successfully"));
  } catch (err) {
    console.error("Error inserting weekly data:", err);
    return next(new ApiError(500, "Database Error"));
  }
});

const insertYearly = asyncHandler(async (req, res, next) => {
  const { phoneno, unit } = req.body;
  const currentDate = new Date();

  console.log("Inserting yearly data:", { phoneno, unit });

  try {
    await db
      .promise()
      .query(
        `INSERT INTO yearly_usage (phoneno, unit, time) VALUES (?, ?, ?)`,
        [phoneno, unit, currentDate]
      );

    console.log("Yearly data inserted successfully");

    return res.status(200).json(new ApiResponse(200, "Inserted successfully"));
  } catch (err) {
    console.error("Error inserting yearly data:", err);
    return next(new ApiError(500, "Database Error"));
  }
});

const retiveHourlyUsage = asyncHandler(async (req, res, next) => {
  const user = req?.user;

  if (!user) {
    return next(new ApiError(400, "User not authenticated"));
  }

  console.log(`Hourly Retrieval: ${user.id}`);

  try {
    const [result] = await db
      .promise()
      .query(
        "SELECT unit, time FROM daily_usage WHERE phoneno = ? ORDER BY time ASC",
        [user.id]
      );

    if (result.length === 0) {
      console.log("No data found for the specified user");
      return next(new ApiError(404, "No hourly data found"));
    }

    let unitsPerHour = new Array(24).fill(0);

    // Log the raw result
    console.log("Raw hourly data retrieved:", result);

    result.forEach((entry) => {
      const hour = new Date(entry.time).getHours();
      console.log(
        `For time: ${entry.time}, updating hour ${hour} with unit: ${entry.unit}`
      );
      unitsPerHour[hour] = entry.unit;
    });

    console.log("Units per hour:", unitsPerHour);

    return res
      .status(200)
      .json(new ApiResponse(200, unitsPerHour, "Data Sent"));
  } catch (err) {
    console.error("Error retrieving hourly usage:", err);
    return next(new ApiError(500, "Database Error"));
  }
});

const retiveWeeklyUsage = asyncHandler(async (req, res, next) => {
  const user = req?.user;

  if (!user) {
    return next(new ApiError(400, "User not authenticated"));
  }

  try {
    const [result] = await db
      .promise()
      .query(
        "SELECT unit, time FROM weekly_usage WHERE phoneno = ? ORDER BY time ASC",
        [user.id]
      );

    if (result.length === 0) {
      console.log("No weekly data found for the specified user");
      return next(new ApiError(404, "No weekly data found"));
    }

    let unitsPerDay = new Array(7).fill(0);

    console.log("Raw weekly data retrieved:", result);

    result.forEach((entry) => {
      const day = new Date(entry.time).getDay();
      console.log(
        `For time: ${entry.time}, updating day ${day} with unit: ${entry.unit}`
      );
      unitsPerDay[day] = entry.unit;
    });

    console.log("Units per day:", unitsPerDay);

    return res.status(200).json(new ApiResponse(200, unitsPerDay, "Data Sent"));
  } catch (err) {
    console.error("Error retrieving weekly usage:", err);
    return next(new ApiError(500, "Database Error"));
  }
});

const retiveYearlyUsage = asyncHandler(async (req, res, next) => {
  const user = req?.user;

  if (!user) {
    return next(new ApiError(400, "User not authenticated"));
  }

  try {
    const [result] = await db
      .promise()
      .query(
        "SELECT unit, time FROM yearly_usage WHERE phoneno = ? ORDER BY time ASC",
        [user.id]
      );

    if (result.length === 0) {
      console.log("No yearly data found for the specified user");
      return next(new ApiError(404, "No yearly data found"));
    }

    let unitsPerMonth = new Array(12).fill(0);

    // Log the raw result
    console.log("Raw yearly data retrieved:", result);

    result.forEach((entry) => {
      const month = new Date(entry.time).getMonth();
      console.log(
        `For time: ${entry.time}, updating month ${month} with unit: ${entry.unit}`
      );
      unitsPerMonth[month] = entry.unit;
    });

    console.log("Units per month:", unitsPerMonth);

    return res
      .status(200)
      .json(new ApiResponse(200, unitsPerMonth, "Data Sent"));
  } catch (err) {
    console.error("Error retrieving yearly usage:", err);
    return next(new ApiError(500, "Database Error"));
  }
});

const sentData = asyncHandler(async (req, res, next) => {
  const { phoneno, voltage, current, MACadd } = req.query;
  const currentDate = new Date();
  const mysqlTimestamp = `${currentDate.getFullYear()}-${(
    currentDate.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${currentDate
    .getDate()
    .toString()
    .padStart(2, "0")} ${currentDate
    .getHours()
    .toString()
    .padStart(2, "0")}:${currentDate
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${currentDate.getSeconds().toString().padStart(2, "0")}`;

  console.log("Received data:", { phoneno, voltage, current, MACadd });

  try {
    const [result] = await db
      .promise()
      .query("SELECT watt FROM client_dets WHERE phoneno = ?", [phoneno]);

    if (result.length === 0) {
      console.log(`Client with phoneno ${phoneno} not found`);
      return next(new ApiError(404, "Client not found"));
    }

    const watt = result[0].watt;
    const newWatt = voltage * current + watt;
    console.log(`Calculated new watt value for phoneno ${phoneno}:`, newWatt);

    const updateQuery = `
      UPDATE client_dets SET
        voltage = ?,
        current = ?,
        MACadd = ?,
        watt = ?, 
        date_time = ?
      WHERE phoneno = ?
    `;
    const updateParams = [
      voltage,
      current,
      MACadd,
      newWatt,
      mysqlTimestamp,
      phoneno,
    ];

    const [updateResult] = await db.promise().query(updateQuery, updateParams);

    if (updateResult.affectedRows === 0) {
      console.log(`No client found with phoneno ${phoneno}`);
      return next(new ApiError(404, "No matching client found"));
    }

    console.log(`Client data updated successfully for phoneno ${phoneno}`);

    return res.status(200).json({
      status: 200,
      message: "Client data updated successfully",
      data: updateResult,
    });
  } catch (err) {
    console.error("Error handling data update:", err);
    return next(new ApiError(500, "Database error"));
  }
});

const getUserData = asyncHandler(async (req, res, next) => {
  try {
    const [result] = await db
      .promise()
      .query("SELECT name, email, phoneno, role FROM users WHERE phoneno = ?", [
        req.user.id,
      ]);

    if (result.length === 0) {
      console.log("No user data found for the specified user");
      return next(new ApiError(404, "User not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, result[0], "Data retrieved successfully"));
  } catch (err) {
    console.error("Error retrieving user data:", err);
    return next(new ApiError(500, "Database error"));
  }
});

const retriveState = asyncHandler(async (req, res, next) => {
  const stateDetailsQuery = "SELECT state FROM bill_details";
  const [stateDetails] = await db.promise().query(stateDetailsQuery);

  if (!stateDetails || stateDetails.length === 0) {
    console.log("No bill details found.");
    return next(new ApiError(404, "No Bill Details Found"));
  }

  console.log("Fetched state details:", stateDetails);

  return res.status(200).json(
    new ApiResponse(
      200,
      state,
      "Details Fetched"
    )
  );
});

export {
  getData,
  register,
  login,
  googleLogin,
  generateToken,
  addPhoneno,
  update,
  sendMail,
  resetPassword,
  insertHourly,
  insertWeekly,
  insertYearly,
  sentData,
  retiveHourlyUsage,
  retiveWeeklyUsage,
  retiveYearlyUsage,
  getUserData,
  retriveState,
};
