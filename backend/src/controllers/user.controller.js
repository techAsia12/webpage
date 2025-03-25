import db from "../db/index.js";
import { asyncHandler } from "../utils/asyncHaldler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import nodemailer from "nodemailer";
import axios from "axios";
import moment from "moment-timezone";

const options = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  path: "/",
  maxAge: process.env.JWT_EXPIRATION,
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
    const insertUserResult = await db
      .promise()
      .query(
        "INSERT INTO users (phoneno, name, password, email, role) VALUES (?, ?, ?, ?, ?)",
        [phoneno, name, hashPassword, email, role]
      );

    if (!insertUserResult.affectedRows) {
      console.log("Failed to insert user into 'users' table");
      throw new Error("Failed to insert user into 'users' table");
    }

    console.log("Inserting client details into 'client_dets' table...");
    const insertClientResult = await db
      .promise()
      .query(
        "INSERT INTO client_dets (phoneno, state, MACadd) VALUES (?, ?, ?)",
        [phoneno, state, null]
      );

    if (!insertClientResult.affectedRows) {
      console.log(
        "Failed to insert client details. Rolling back user insert..."
      );
      db.promise().query("DELETE FROM users WHERE phoneno=?", [phoneno]);
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
  const { email, password, role, recaptcha } = req.body;

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptcha}`
    );

    console.log("reCAPTCHA verification response:", response.data);
    if (!response.data.success) {
      return next(new ApiError(400, "reCAPTCHA verification failed"));
    }

    const [user] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ? AND role = ?", [email, role]);

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
  const { token, role } = req.body;

  try {
    const decoded = jwt.decode(token, { complete: true });
    const { name, email } = decoded.payload;

    const [user] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ? AND role=?", [email, role]);

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
      await db
        .promise()
        .query("INSERT INTO users (name, email,role) VALUES (?, ?, ?)", [
          name,
          email,
          role,
        ]);
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
    console.error("Google login error:", error);
    return next(new ApiError(500, "Google login error"));
  }
});

const addPhoneno = asyncHandler(async (req, res, next) => {
  const { email, phone: phoneno, role, state } = req.body;

  if (!phoneno || !email || !role || !state) {
    return next(new ApiError(400, "Missing required fields"));
  }

  console.log(
    "Received phone number:",
    phoneno,
    "for email:",
    email,
    "role:",
    role
  );
  try {
    await db
      .promise()
      .query("UPDATE users SET phoneno = ? WHERE email = ? AND role = ?", [
        phoneno,
        email,
        role,
      ]);

    if (role === "Client") {
      try {
        console.log("Inserting client details into 'client_dets' table...", {
          phoneno,
          state,
        });

        await db
          .promise()
          .query(
            "INSERT INTO client_dets (phoneno, state, MACadd) VALUES (?, ?, ?)",
            [phoneno, state, 0]
          );

        console.log("Data inserted successfully");
      } catch (error) {
        await db
          .promise()
          .query("DELETE FROM client_dets WHERE phoneno=?", [phoneno]);
        await db
          .promise()
          .query("DELETE FROM users WHERE phoneno=?", [phoneno]);
        console.error("Error adding phone number:", error);
        return next(new ApiError(500, "Something went wrong while try again"));
      }
    }

    const token = generateToken({ id: phoneno, email });
    res.cookie("authToken", token, options);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user: { id: phoneno, email }, token },
          "Registered successfully"
        )
      );
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      console.error("Error adding phone number:", error);
      return next(new ApiError(400, "User already exists"));
    }
    console.error("Error adding phone number:", error);
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
        "SELECT phoneno, MACadd, voltage, current, units,watt, date_time, state, totalCost, costToday, threshold FROM client_dets WHERE phoneno = ?",
        [user.id]
      );

    if (result.length === 0) {
      return next(new ApiError(404, "No data found"));
    }

    let costToday = 0;
    try {
      const currentDate = new Date().toISOString().split("T")[0];
      const [costResult] = await db
        .promise()
        .query(
          "SELECT costToday FROM client_dets WHERE phoneno = ? AND DATE(date_time) = ?",
          [user.id, currentDate]
        );

      if (costResult.length > 0) {
        costToday = costResult[0].costToday;
      }
    } catch (error) {
      console.error("Error fetching costToday:", error);
    }

    const data = { ...result[0], costToday };
    return res
      .status(200)
      .json(new ApiResponse(200, data, "Data successfully fetched"));
  } catch (err) {
    console.error("Database error:", err);
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
    const result = await db
      .promise()
      .query("UPDATE users SET name=?, email=? WHERE phoneno=?", [
        name,
        email,
        user.id,
      ]);
    console.log("User details updated:", result);

    if (state) {
      console.log("Updating client state in the database...");
      await db
        .promise()
        .query("UPDATE client_dets SET state = ? WHERE phoneno=?", [
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
    console.log("Hourly Usage:", unitsPerHour);
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

    console.log(unitsPerDay);
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

const costCalc = (unit, billDets) => {
  const calc = (unit, cos, index, billDets) => {
    const base = unit * cos + billDets.base;
    const tax1 = unit * billDets.percentPerUnit;
    const tax2 = unit * billDets.range[index].taxPerUnit;
    const tax3 = (billDets.totalTaxPercent / 100) * (base + tax1 + tax2);
    const total = base + tax1 + tax2 + tax3 + billDets.tax;

    return { base, total };
  };

  let { base, total } = { base: 0, total: 0 };

  if (unit > billDets.range[3].unitRange) {
    ({ base, total } = calc(unit, billDets.range[3].cost, 3, billDets));
  } else if (unit > billDets.range[2].unitRange) {
    ({ base, total } = calc(unit, billDets.range[2].cost, 2, billDets));
  } else if (unit > billDets.range[1].unitRange) {
    ({ base, total } = calc(unit, billDets.range[1].cost, 1, billDets));
  } else {
    ({ base, total } = calc(unit, billDets.range[0].cost, 0, billDets));
  }
  return parseFloat(total.toFixed());
};

const sentData = asyncHandler(async (req, res, next) => {
  const { phoneno, voltage, current, MACadd } = req.query;

  // Validate input parameters
  if (!phoneno || !voltage || !current) {
    return next(new ApiError(400, "Missing required parameters"));
  }

  // Convert to numbers and validate
  const validVoltage = parseFloat(voltage);
  const validCurrent = parseFloat(current);
  if (isNaN(validVoltage) || isNaN(validCurrent)) {
    return next(new ApiError(400, "Invalid voltage or current values"));
  }

  // Get current date and time in Asia/Kolkata timezone
  const currentDate = moment().tz("Asia/Kolkata");
  const mysqlTimestamp = currentDate.format("YYYY-MM-DD HH:mm:ss");
  const currentHour = currentDate.hours();
  const currentDay = currentDate.format("YYYY-MM-DD");
  const currentMonth = currentDate.month() + 1;
  const currentYear = currentDate.year();

  try {
    // Get client data in a transaction to ensure consistency
    const connection = await db.promise().getConnection();
    await connection.beginTransaction();

    try {
      const [clientResult] = await connection.query(
        "SELECT units, state, threshold, emailSent FROM client_dets WHERE phoneno = ? FOR UPDATE",
        [phoneno]
      );

      if (clientResult.length === 0) {
        await connection.rollback();
        return next(new ApiError(404, "Client not found"));
      }

      const clientData = clientResult[0];
      const currentUnits = clientData.units || 0;
      const state = clientData.state;
      let threshold = clientData.threshold;
      let emailSent = clientData.emailSent;

      // Calculate energy consumption for 15-second interval (in kWh)
      const intervalHours = 15 / 3600; // Convert 15 seconds to hours
      const kwh = Math.max(
        0,
        (validVoltage * validCurrent * intervalHours) / 1000
      );
      const newUnits = currentUnits + kwh;

      if (kwh <= 0) {
        console.warn(
          `Low/negative kWh calculation: ${kwh}. Check sensor values.`
        );
      }

      // Update usage records only if kWh is positive
      if (kwh > 0) {
        // Update hourly usage (for current hour)
        await updateHourlyUsage(
          connection,
          phoneno,
          kwh,
          currentDay,
          currentHour,
          mysqlTimestamp
        );

        // Update daily usage (for current day)
        await updateDailyUsage(connection, phoneno, kwh, currentDay);

        // Update monthly usage (for current month)
        await updateMonthlyUsage(
          connection,
          phoneno,
          kwh,
          currentYear,
          currentMonth,
          mysqlTimestamp
        );
      }

      // Fetch bill details
      const [billDetailsResult] = await connection.query(
        "SELECT * FROM bill_details WHERE state = ?",
        [state]
      );

      if (!billDetailsResult || billDetailsResult.length === 0) {
        await connection.rollback();
        return next(new ApiError(404, "No Bill Details Found"));
      }

      const billDetails = billDetailsResult[0];

      const [costDetailsResult] = await connection.query(
        "SELECT * FROM cost_per_unit WHERE state = ? ORDER BY unitRange ASC",
        [state]
      );

      if (!costDetailsResult || costDetailsResult.length === 0) {
        await connection.rollback();
        return next(new ApiError(404, "No Cost Details Found"));
      }

      const billDets = {
        base: billDetails.base,
        percentPerUnit: billDetails.percentPerUnit,
        state: billDetails.state,
        tax: billDetails.tax,
        totalTaxPercent: billDetails.totalTaxPercent,
        range: costDetailsResult,
      };

      // Calculate costs
      const totalCost = costCalc(newUnits, billDets);

      // Get today's total usage for cost calculation
      const [dailyUsageResult] = await connection.query(
        "SELECT SUM(unit) as total FROM daily_usage WHERE phoneno = ? AND DATE(time) = ?",
        [phoneno, currentDay]
      );

      const totalDailyUsage = dailyUsageResult[0]?.total || 0;
      let costToday = 0;
      if (totalDailyUsage > costDetailsResult[3].unitRange) {
        costToday = costDetailsResult[3].cost * totalDailyUsage;
      } else if (totalDailyUsage > costDetailsResult[2].unitRange) {
        costToday = costDetailsResult[2].cost * totalDailyUsage;
      } else if (totalDailyUsage > costDetailsResult[1].unitRange) {
        costToday = costDetailsResult[1].cost * totalDailyUsage;
      } else {
        costToday = costDetailsResult[0].cost * totalDailyUsage;
      }
      // const costToday = costCalc(totalDailyUsage, billDets);

      // Check threshold and send email if needed
      if (threshold < totalCost && emailSent === 0) {
        const [userResult] = await connection.query(
          "SELECT email FROM users WHERE phoneno = ?",
          [phoneno]
        );

        if (userResult.length > 0) {
          const userEmail = userResult[0].email;
          await sendMessage(userEmail, totalCost, threshold);

          emailSent = 1; // Mark email as sent
          threshold = Math.floor(threshold * 1.5); // Increase threshold by 50%
        }
      }

      // Check if it's the last day of the month at midnight
      const isLastDayOfMonth =
        currentDate.date() === currentDate.endOf("month").date() &&
        currentDate.hour() === 0 &&
        currentDate.minute() === 0;

      // Update client_dets table
      const updateQuery = `
        UPDATE client_dets SET
          voltage = ?,
          current = ?,
          MACadd = ?,
          units = ?,
          watt = ?,
          date_time = ?,
          totalCost = ?,
          costToday = ?,
          threshold = ?,
          emailSent = ?,
          state = ?
        WHERE phoneno = ?
      `;

      const updateParams = [
        validVoltage,
        validCurrent,
        MACadd,
        isLastDayOfMonth ? 0 : newUnits, // Reset if last day of month
        validVoltage * validCurrent,
        mysqlTimestamp,
        isLastDayOfMonth ? 0 : totalCost, // Reset if last day of month
        isLastDayOfMonth ? 0 : costToday, // Reset if last day of month
        threshold,
        emailSent,
        state,
        phoneno,
      ];

      await connection.query(updateQuery, updateParams);
      await connection.commit();

      console.log("Client data updated successfully.");
      return res.status(200).json({
        status: 200,
        message: "Client data updated successfully",
        data: {
          phoneno,
          newUnits: isLastDayOfMonth ? 0 : newUnits,
          totalCost: isLastDayOfMonth ? 0 : totalCost,
          costToday: isLastDayOfMonth ? 0 : costToday,
        },
      });
    } catch (err) {
      await connection.rollback();
      console.error("Database error in transaction:", err);
      throw err;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error("Database error:", err);
    return next(new ApiError(500, "Database error"));
  }
});

// Helper function to update hourly usage
async function updateHourlyUsage(
  connection,
  phoneno,
  kwh,
  currentDay,
  currentHour,
  timestamp
) {
  // Check for existing record for this hour
  const [existing] = await connection.query(
    `SELECT * FROM daily_usage WHERE phoneno = ? AND DATE(time) = ? AND HOUR(time) = ?`,
    [phoneno, currentDay, currentHour]
  );

  if (existing.length > 0) {
    // Update existing record
    await connection.query(
      `UPDATE daily_usage SET unit = unit + ?, time = ? WHERE phoneno = ? AND DATE(time) = ? AND HOUR(time) = ?`,
      [kwh, timestamp, phoneno, currentDay, currentHour]
    );
  } else {
    // Insert new record
    await connection.query(
      `INSERT INTO daily_usage (phoneno, unit, time) VALUES (?, ?, ?)`,
      [phoneno, kwh, timestamp]
    );
  }
}

// Helper function to update daily usage
async function updateDailyUsage(connection, phoneno, kwh, currentDay) {
  // Check for existing record for today
  const [existing] = await connection.query(
    `SELECT * FROM weekly_usage WHERE phoneno = ? AND DATE(time) = ?`,
    [phoneno, currentDay]
  );

  if (existing.length > 0) {
    // Update existing record
    await connection.query(
      `UPDATE weekly_usage SET unit = unit + ? WHERE phoneno = ? AND DATE(time) = ?`,
      [kwh, phoneno, currentDay]
    );
  } else {
    // Insert new record
    await connection.query(
      `INSERT INTO weekly_usage (phoneno, unit, time) VALUES (?, ?, ?)`,
      [phoneno, kwh, `${currentDay} 00:00:00`]
    );
  }
}

// Helper function to update monthly usage
async function updateMonthlyUsage(
  connection,
  phoneno,
  kwh,
  currentYear,
  currentMonth,
  timestamp
) {
  // Check for existing record for this month
  const [existing] = await connection.query(
    `SELECT * FROM yearly_usage WHERE phoneno = ? AND YEAR(time) = ? AND MONTH(time) = ?`,
    [phoneno, currentYear, currentMonth]
  );

  if (existing.length > 0) {
    // Update existing record
    await connection.query(
      `UPDATE yearly_usage SET unit = unit + ?, time = ? WHERE phoneno = ? AND YEAR(time) = ? AND MONTH(time) = ?`,
      [kwh, timestamp, phoneno, currentYear, currentMonth]
    );
  } else {
    // Insert new record
    await connection.query(
      `INSERT INTO yearly_usage (phoneno, unit, time) VALUES (?, ?, ?)`,
      [phoneno, kwh, timestamp]
    );
  }
}

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
    return res.status(400).json({ error: "All fields are required." });
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

const sendMessage = async (email, totalCost, threshold) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"TechAsia" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "⚠️ Electricity Consumption Alert",
    text: `Hello,
    
    Alert: Your electricity consumption has exceeded the set limit.
    
    The current usage has surpassed ₹${threshold} with an amount of ₹${totalCost}. Please take necessary actions to avoid additional charges or service disruption.
    
    If you have any questions, please contact your service provider.
    
    Best regards,  
    TechAsia Support Team`,
  };

  await transporter.sendMail(mailOptions);

  console.log(`Email successfully sent to: ${email}`);
};

const setThershold = asyncHandler(async (req, res, next) => {
  try {
    console.log("Request body:", req.body);
    const { threshold } = req.body;

    console.log("Authenticated user:", req.user);
    const phone = req.user.id;

    console.log(
      "Updating threshold for phone:",
      phone,
      "with threshold:",
      threshold
    );

    const updateQuery = `
      UPDATE client_dets SET threshold=?
      WHERE phoneno = ?
    `;
    const updateParams = [threshold, phone];

    console.log("Executing update query...");
    const [result] = await db.promise().query(updateQuery, updateParams);

    console.log("Database query result:", result);

    if (result.affectedRows === 0) {
      console.log("No rows affected. User not found or no changes made.");
      return next(new ApiError(404, "User not found or no changes made"));
    }

    console.log("Threshold updated successfully.");
    return res
      .status(200)
      .json(new ApiResponse(200, result, "Threshold set successfully"));
  } catch (error) {
    console.error("Error setting threshold:", error);
    return next(new ApiError(500, "Internal Server Error"));
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
  setThershold,
};
