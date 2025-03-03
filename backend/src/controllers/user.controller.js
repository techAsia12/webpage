import db from "../db/index.js";
import { asyncHandler } from "../utils/asyncHaldler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import nodemailer from "nodemailer";

const options = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  path: "/",
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

  console.log("Received registration data:", {
    name,
    email,
    phoneno,
    state,
    role,
  });

  if (!name || !password || !email || !state || !role) {
    console.log("Missing required fields");
    return next(new ApiError(400, "All fields are required"));
  }

  if (phoneno.length !== 10 || isNaN(phoneno)) {
    console.log("Invalid phone number:", phoneno);
    return next(
      new ApiError(400, "Please enter a valid 10-digit phone number")
    );
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(email)) {
    console.log("Invalid email format:", email);
    return next(new ApiError(400, "Invalid email format"));
  }

  try {
    console.log("Hashing password...");
    const hashPassword = await bcrypt.hash(password, 10);

    console.log("Inserting user into 'users' table...");
    const insertUserResult = await dbQuery(
      "INSERT INTO users (phoneno, name, password, email, role) VALUES (?, ?, ?, ?, ?)",
      [phoneno, name, hashPassword, email, role]
    );

    if (!insertUserResult.affectedRows) {
      console.log("Failed to insert user into 'users' table");
      throw new Error("Failed to insert user into 'users' table");
    }

    console.log("Inserting client details into 'client_dets' table...");
    const insertClientResult = await dbQuery(
      "INSERT INTO client_dets (phoneno, state, MACadd) VALUES (?, ?, ?)",
      [phoneno, state, null]
    );

    if (!insertClientResult.affectedRows) {
      console.log(
        "Failed to insert client details. Rolling back user insert..."
      );
      dbQuery("DELETE FROM users WHERE phoneno=?", [phoneno]);
      throw new Error(
        "Failed to insert client details into 'client_dets' table"
      );
    }

    console.log("User registration successful:", { phoneno, email, name });

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
    console.error("Error during registration:", err);

    if (err.code === "ER_DUP_ENTRY") {
      console.log("Duplicate entry found for email");
      return next(new ApiError(400, "Email is already in use"));
    } else if (err.message.includes("Failed to insert")) {
      console.log("Database error:", err.message);
      return next(new ApiError(500, "Database Error: " + err.message));
    }

    console.log("Unexpected error during registration");
    return next(
      new ApiError(500, "An unexpected error occurred during registration")
    );
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
      return next(new ApiError(401, "Invalid credentials: User not found"));
    }

    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return next(new ApiError(401, "Invalid credentials: Incorrect password"));
    }

    const token = generateToken(user[0]);

    res.cookie("authToken", token, options);
    return res
      .status(200)
      .json(
        new ApiResponse(200, { ...user[0], token }, "Successfully logged in")
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
      try {
        await dbQuery(
          "INSERT INTO client_dets (phoneno, state) VALUES (?, ?)",
          [phone, state]
        );
      } catch (error) {
        await dbQuery("DELETE FROM client_dets WHERE phoneno=?", [phone]);
        await dbQuery("DELETE FROM users WHERE phoneno=?", [phone]);
        return next(new ApiError(500, "Something went wrong while try again"));
      }
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
    if (error.code === "ER_DUP_ENTRY") {
      return next(new ApiError(400, "User already exists"));
    }

    return next(new ApiError(500, "Database error"));
  }
});

const getData = asyncHandler(async (req, res, next) => {
  const user = req?.user;

  if (!user) {
    return next(new ApiError(400, "User not authenticated"));
  }

  try {
    const [result] = await db
      .promise()
      .query(
        "SELECT phoneno, MACadd, voltage, current, watt, date_time, state FROM client_dets WHERE phoneno = ?",
        [user.id]
      );

    if (result.length === 0) {
      return next(new ApiError(404, "No data found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, result[0], "Data successfully fetched"));
  } catch (err) {
    return next(new ApiError(500, "Database error"));
  }
});

const update = asyncHandler(async (req, res, next) => {
  const { name, email, state } = req.body;
  const user = req?.user;

  if (!user) {
    console.log("User not authenticated");
    return next(new ApiError(400, "User not authenticated"));
  }

  try {
    console.log("Updating user details in the database...");
    const result = await dbQuery(
      "UPDATE users SET name=?, email=? WHERE phoneno=?",
      [name, email, user.id]
    );
    console.log("User details updated:", result);

    if (state) {
      console.log("Updating client state in the database...");
      await dbQuery("UPDATE client_dets SET state = ? WHERE phoneno=?", [
        state,
        user.id,
      ]);
      console.log("Client state updated");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, result[0], "Updated successfully"));
  } catch (err) {
    console.error("Database error:", err);
    return next(new ApiError(500, "Database error"));
  }
});

const sendVerificationMail = asyncHandler(async (req, res, next) => {
  const { email } = req.query;
  console.log(`Received request to send verification email to: ${email}`);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const verificationCode = generateVerificationCode();
  console.log(`Generated verification code: ${verificationCode}`);

  const mailOptions = {
    from: `"TechAsia" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Password Verification Code",
    text: `Hello,

    We received a request to reset your password. Please use the following code to verify your identity:

    Verification Code: ${verificationCode}

    If you did not request this, please ignore this email.

    Best regards,
    Your Team`,
  };

  try {
    await transporter.sendMail(mailOptions);

    console.log(`Email successfully sent to: ${email}`);

    const payload = await jwt.sign(verificationCode, process.env.JWT_SECRET);

    res.cookie("authCode", payload, options);

    return res.status(200).json(new ApiResponse(200, { email }, "Email Sent"));
  } catch (error) {
    console.error("Error sending email:", error);

    return next(
      new ApiError(
        400,
        "Something went wrong while sending mail, please try again"
      )
    );
  }
});

const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ApiError(400, "Email and password are required"));
  }

  const storedPasswordQuery = "SELECT password FROM users WHERE email = ?";

  try {
    const [rows] = await db.promise().query(storedPasswordQuery, [email]);

    if (rows.length === 0) {
      return next(new ApiError(404, "User not found"));
    }

    const storedPassword = rows[0].password;

    const isMatch = await bcrypt.compare(password, storedPassword);
    if (isMatch) {
      return next(
        new ApiError(400, "New password cannot be the same as the old password")
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updateQuery = "UPDATE users SET password = ? WHERE email = ?";
    const updateParams = [hashedPassword, email];
    await db.promise().query(updateQuery, updateParams);

    return res
      .status(200)
      .json(new ApiResponse(200, "Password reset successfully"));
  } catch (err) {
    return next(
      new ApiError(500, "An error occurred while resetting the password")
    );
  }
});

const insertHourly = asyncHandler(async (phoneno, unit) => {
  const currentDate = new Date();
  const currentHour = currentDate.getHours();

  try {
    const [existingEntry] = await db
      .promise()
      .query("SELECT * FROM daily_usage WHERE phoneno = ? AND HOUR(time) = ?", [
        phoneno,
        currentHour,
      ]);

    if (existingEntry.length > 0) {
      await db
        .promise()
        .query(
          "UPDATE daily_usage SET unit = ?,time=? WHERE phoneno = ? AND HOUR(time) = ?",
          [unit, currentDate, phoneno, currentHour]
        );
      console.log("Hourly data updated successfully");
    } else {
      await db
        .promise()
        .query(
          "INSERT INTO daily_usage (phoneno, unit, time) VALUES (?, ?, ?)",
          [phoneno, unit, currentDate]
        );
      console.log("Hourly data inserted successfully");
    }
  } catch (err) {
    console.error("Error inserting/updating hourly data:", err);
  }
});

const insertDaily = asyncHandler(async (phoneno, unit) => {
  const currentDate = new Date();
  const currentDay = currentDate.toISOString().split("T")[0];

  try {
    const [existingData] = await db
      .promise()
      .query(
        `SELECT * FROM weekly_usage WHERE phoneno = ? AND DATE(time) = ?`,
        [phoneno, currentDay]
      );

    if (existingData.length > 0) {
      await db
        .promise()
        .query(
          `UPDATE weekly_usage SET unit = ? WHERE phoneno = ? AND DATE(time) = ?`,
          [unit, phoneno, currentDay]
        );
      console.log("Daily data updated for weekly tracking");
    } else {
      await db
        .promise()
        .query(
          `INSERT INTO weekly_usage (phoneno, unit, time) VALUES (?, ?, ?)`,
          [phoneno, unit, currentDay]
        );
      console.log("Daily data inserted for weekly tracking");
    }
  } catch (err) {
    console.error("Error inserting/updating daily data:", err);
  }
});

const insertMonthly = asyncHandler(async (phoneno, unit) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  try {
    const [existingData] = await db
      .promise()
      .query(
        `SELECT * FROM yearly_usage WHERE phoneno = ? AND YEAR(time) = ? AND MONTH(time) = ?`,
        [phoneno, currentYear, currentMonth]
      );

    if (existingData.length > 0) {
      await db
        .promise()
        .query(
          `UPDATE yearly_usage SET unit = ? WHERE phoneno = ? AND YEAR(time) = ? AND MONTH(time) = ?`,
          [unit, phoneno, currentYear, currentMonth]
        );
      console.log("Monthly data updated for yearly tracking");
    } else {
      await db
        .promise()
        .query(
          `INSERT INTO yearly_usage (phoneno, unit, time) VALUES (?, ?, ?)`,
          [phoneno, unit, currentDate]
        );
      console.log("Monthly data inserted for yearly tracking");
    }
  } catch (err) {
    console.error("Error inserting/updating monthly data:", err);
  }
});

const retiveCostToday = asyncHandler(async (req, res, next) => {
  const user = req?.user;
  const previousDay = new Date();
  previousDay.setDate(previousDay.getDate() - 1);
  const prevDateString = previousDay.toISOString().split("T")[0];
  const todayDateString = new Date().toISOString().split("T")[0];

  console.log("User:", user);
  console.log("Previous Day:", prevDateString);
  console.log("Today:", todayDateString);

  if (!user) {
    return next(new ApiError(400, "User not authenticated"));
  }

  try {
    const [result] = await db.promise().query(
      `SELECT unit, DATE(time) as date FROM weekly_usage 
       WHERE phoneno = ? 
       AND DATE(time) BETWEEN DATE_SUB(CURDATE(), INTERVAL 1 DAY) AND CURDATE()
       ORDER BY time ASC`,
      [user.id]
    );

    console.log("Query Result:", result);

    if (result.length === 0) {
      return next(new ApiError(404, "No data found"));
    }

    let previousDayData = 0;
    let todayData = 0;

    result.forEach((entry) => {
      console.log("Entry:", entry);
      if (entry.date === prevDateString) {
        previousDayData += entry.unit;
      } else if (entry.date === todayDateString) {
        todayData += entry.unit;
      }
    });

    console.log("Previous Day Usage:", previousDayData);
    console.log("Today's Usage:", todayData);

    const costToday = previousDayData - todayData;
    console.log("Cost Difference:", costToday);

    return res.status(200).json(new ApiResponse(200, costToday, "Data Sent"));
  } catch (err) {
    console.error("Database Error:", err);
    return next(new ApiError(500, "Database Error"));
  }
});

const retiveHourlyUsage = asyncHandler(async (req, res, next) => {
  const user = req?.user;

  if (!user) {
    return next(new ApiError(400, "User not authenticated"));
  }

  try {
    const [result] = await db.promise().query(
      `SELECT unit, time 
         FROM daily_usage 
         WHERE phoneno = ? 
         AND DATE(time) = CURDATE() 
         ORDER BY time ASC`,
      [user.id]
    );

    if (result.length === 0) {
      return next(new ApiError(404, "No hourly data found"));
    }

    let unitsPerHour = new Array(24).fill(0);

    result.forEach((entry) => {
      const hour = new Date(entry.time).getHours();
      unitsPerHour[hour] = entry.unit;
    });

    return res
      .status(200)
      .json(new ApiResponse(200, unitsPerHour, "Data Sent"));
  } catch (err) {
    return next(new ApiError(500, "Database Error"));
  }
});

const retiveWeeklyUsage = asyncHandler(async (req, res, next) => {
  const user = req?.user;

  if (!user) {
    return next(new ApiError(400, "User not authenticated"));
  }

  try {
    const [result] = await db.promise().query(
      `SELECT unit, time FROM weekly_usage 
        WHERE phoneno = ? 
        AND YEARWEEK(time) = YEARWEEK(CURDATE()) 
        ORDER BY time ASC`,
      [user.id]
    );

    if (result.length === 0) {
      return next(new ApiError(404, "No weekly data found"));
    }

    let unitsPerDay = new Array(7).fill(0);

    result.forEach((entry) => {
      const day = new Date(entry.time).getDay();
      unitsPerDay[day] = entry.unit;
    });

    return res.status(200).json(new ApiResponse(200, unitsPerDay, "Data Sent"));
  } catch (err) {
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
      return next(new ApiError(404, "No yearly data found"));
    }

    let unitsPerMonth = new Array(12).fill(0);

    result.forEach((entry) => {
      const month = new Date(entry.time).getMonth();
      unitsPerMonth[month] = entry.unit;
    });

    return res
      .status(200)
      .json(new ApiResponse(200, unitsPerMonth, "Data Sent"));
  } catch (err) {
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

  console.log(
    `Received data: phoneno=${phoneno}, voltage=${voltage}, current=${current}, MACadd=${MACadd}`
  );

  try {
    console.log("Fetching current watt value from database...");
    const [result] = await db
      .promise()
      .query("SELECT watt,date_time FROM client_dets WHERE phoneno = ?", [
        phoneno,
      ]);

    if (result.length === 0) {
      console.log("Client not found in database");
      return next(new ApiError(404, "Client not found"));
    }

    const watt = result[0].watt === null ? 1 : result[0].watt;
    console.log(`Current watt: ${watt}, calculating new watt...`);

    const prevtime = result[0].date_time;

    const prevDate = new Date(prevtime);
    const timeDifferenceInMs = currentDate - prevDate;
    const timeInHours = timeDifferenceInMs / (1000 * 60 * 60);

    console.log(`Previous time: ${timeInHours} hours ago`);
    console.log(`Current watt: ${watt}, calculating new watt...`);

    const kwh = (voltage * current * timeInHours) / 1000;
    const newWatt = watt + kwh;
    console.log(`New watt value calculated: ${newWatt}`);

    console.log(`New watt value calculated: ${newWatt}`);

    console.log(
      "Watt value is a whole integer, updating hourly, daily, and monthly data..."
    );
    if (watt !== newWatt || prevtime.getHours() !== currentDate.getHours()) {
      await insertHourly(phoneno, newWatt);
      await insertDaily(phoneno, newWatt);
      await insertMonthly(phoneno, newWatt);
    }

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

    console.log("Executing update query...");
    const [updateResult] = await db.promise().query(updateQuery, updateParams);

    if (updateResult.affectedRows === 0) {
      console.log("No rows affected, client data update failed.");
      return next(new ApiError(404, "No matching client found"));
    }

    console.log("Client data updated successfully.");
    return res.status(200).json({
      status: 200,
      message: "Client data updated successfully",
      data: updateResult,
    });
  } catch (err) {
    console.error("Database error:", err);
    return next(new ApiError(500, "Database error"));
  }
});

const getUserData = asyncHandler(async (req, res, next) => {
  try {
    const [result] = await db
      .promise()
      .query(
        "SELECT name, email, phoneno, role,profile FROM users WHERE phoneno = ?",
        [req.user.id]
      );

    if (result.length === 0) {
      return next(new ApiError(404, "User not found"));
    }

    if (result[0].role === "Client") {
      const [resl] = await db
        .promise()
        .query("SELECT state FROM client_dets WHERE phoneno = ?", [
          req.user.id,
        ]);
      const { role, name, email, phoneno, profile } = result[0];
      const { state } = resl[0];

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { name, email, phoneno, state, role, profile },
            "Data retrieved successfully"
          )
        );
    }

    return res
      .status(200)
      .json(new ApiResponse(200, result[0], "Data retrieved successfully"));
  } catch (err) {
    return next(new ApiError(500, "Database error"));
  }
});

const retriveState = asyncHandler(async (req, res, next) => {
  try {
    const stateDetailsQuery = "SELECT state FROM bill_details";
    const [stateDetails] = await db.promise().query(stateDetailsQuery);

    if (!stateDetails || stateDetails.length === 0) {
      return next(new ApiError(404, "No Bill Details Found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, stateDetails, "Details Fetched"));
  } catch (err) {
    return next(new ApiError(500, "Database Error"));
  }
});

const deleteUser = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  try {
    console.log("Starting transaction...");
    await db.promise().query("START TRANSACTION");

    const [userResult] = await db
      .promise()
      .query("SELECT * FROM users WHERE phoneno=?", [userId]);

    if (userResult.length === 0) {
      return next(new ApiError(404, "User not found"));
    }

    if (req.user.role === "Client") {
      const [clientDetResult] = await db
        .promise()
        .query("SELECT MACadd FROM client_dets WHERE phoneno=?", [userId]);

      if (clientDetResult.length > 0) {
        console.log(
          `User is a client. Deleting client details from 'client_dets' table.`
        );
        await db
          .promise()
          .query("DELETE FROM client_dets WHERE phoneno=?", [userId]);
      }

      const [DailyDetResult] = await db
        .promise()
        .query("SELECT * FROM daily_usage WHERE phoneno=?", [userId]);
      if (DailyDetResult.length > 0) {
        await db
          .promise()
          .query("DELETE FROM daily_usage WHERE phoneno=?", [userId]);
      }

      const [WeeklyDetResult] = await db
        .promise()
        .query("SELECT * FROM weekly_usage WHERE phoneno=?", [userId]);
      if (WeeklyDetResult.length > 0) {
        await db
          .promise()
          .query("DELETE FROM weekly_usage WHERE phoneno=?", [userId]);
      }

      const [YearlyDetResult] = await db
        .promise()
        .query("SELECT * FROM yearly_usage WHERE phoneno=?", [userId]);
      if (YearlyDetResult.length > 0) {
        await db
          .promise()
          .query("DELETE FROM yearly_usage WHERE phoneno=?", [userId]);
      }
    }

    await db.promise().query("DELETE FROM users WHERE phoneno=?", [userId]);

    await db.promise().query("COMMIT");

    return res
      .status(200)
      .json(new ApiResponse(200, "Account Deleted Successfully"));
  } catch (error) {
    await db.promise().query("ROLLBACK");
    console.error("Error occurred during deletion:", error);
    return next(new ApiError(400, "Something went wrong while Deleting"));
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

const sendMail = asyncHandler(async (req, res, next) => {
  const { name, email, phoneno, message } = req.body;

  if (!name || !email || !message || !phoneno) {
    return res
      .status(400)
      .json({ error: "All fields are required." });
  }
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.GMAIL_USER,
    subject: `New message from ${name}`,
    text: message,
    html: `<p><strong>From:</strong> ${name} (${email}) (${phoneno})</p><p><strong>Message:</strong><br>${message}</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(
      `Email sent successfully from: ${email} to: ${process.env.GMAIL_USER}`
    );

    return res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res
      .status(500)
      .json({ error: "Failed to send email. Please try again later." });
  }
});

export {
  getData,
  register,
  login,
  googleLogin,
  generateToken,
  addPhoneno,
  update,
  sendVerificationMail,
  resetPassword,
  sentData,
  retiveHourlyUsage,
  retiveWeeklyUsage,
  retiveYearlyUsage,
  getUserData,
  retriveState,
  deleteUser,
  updateProfile,
  retiveCostToday,
  sendMail,
};
