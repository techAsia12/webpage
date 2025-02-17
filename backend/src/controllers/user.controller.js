import db from "../db/index.js";
import { asyncHandler } from "../utils/asyncHaldler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { MailtrapClient } from "mailtrap";
import { verifyJWT } from "../middleware/authUser.middlerware.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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

  if (!name || !password || !email || !state || !role) {
    return next(new ApiError(400, "All fields are required"));
  }

  if (phoneno.length !== 10 || isNaN(phoneno)) {
    return next(
      new ApiError(400, "Please enter a valid 10-digit phone number")
    );
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(email)) {
    return next(new ApiError(400, "Invalid email format"));
  }

  try {
    const hashPassword = await bcrypt.hash(password, 10);

    const insertUserResult = await dbQuery(
      "INSERT INTO users (phoneno, name, password, email, role) VALUES (?, ?, ?, ?, ?)",
      [phoneno, name, hashPassword, email, role]
    );
    if (!insertUserResult.affectedRows) {
      throw new Error("Failed to insert user into 'users' table");
    }

    const insertClientResult = await dbQuery(
      "INSERT INTO client_dets (phoneno, state, MACadd) VALUES (?, ?, ?)",
      [phoneno, state, null]
    );
    if (!insertClientResult.affectedRows) {
      dbQuery("DELETE FROM users WHERE phoeno=?", [phoneno]);
      throw new Error(
        "Failed to insert client details into 'client_dets' table"
      );
    }

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
    if (err.code === "ER_DUP_ENTRY") {
      return next(new ApiError(400, "Email is already in use"));
    } else if (err.message.includes("Failed to insert")) {
      return next(new ApiError(500, "Database Error: " + err.message));
    }

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
  const { profilePath } = req?.files;
  const user = req?.user;

  if (!user) {
    return next(new ApiError(400, "User not authenticated"));
  }

  try {
    const profile=await uploadOnCloudinary(profilePath);
    
    const result = await dbQuery(
      "UPDATE users SET name=?, email=?,profile=? WHERE phoneno=?",
      [name, email,profile, user.id]
    );

    if (state) {
      await dbQuery("UPDATE client_dets SET state = ? WHERE phoneno=?", [
        state,
        user.id,
      ]);
    }

    return res
      .status(200)
      .json(new ApiResponse(200, result[0], "Updated successfully"));
  } catch (err) {
    return next(new ApiError(500, "Database error"));
  }
});

const sendMail = asyncHandler(async (req, res, next) => {
  const { email } = req.query;
  const TOKEN = process.env.TOKEN;

  const client = new MailtrapClient({
    endpoint: "https://send.api.mailtrap.io/",
    token: "472e8e82d10c7ada7cd1be176daea98d",
  });

  const verificationCode = generateVerificationCode();

  try {
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

    return res
      .status(200)
      .json(new ApiResponse(200, { verificationCode, email }, "Email Sent"));
  } catch (error) {
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
  try {
    await db
      .promise()
      .query(`INSERT INTO daily_usage (phoneno, unit, time) VALUES (?, ?, ?)`, [
        phoneno,
        unit,
        currentDate,
      ]);
    console.log("Hourly data inserted successfully");

    // Optionally reset the daily usage table for the specific user
    await db
      .promise()
      .query(`DELETE FROM daily_usage WHERE phoneno = ?`, [phoneno]);

    console.log("Hourly data reset after insert");
  } catch (err) {
    console.error("Error inserting hourly data:", err);
  }
});

const insertWeekly = asyncHandler(async (phoneno, unit) => {
  const currentDate = new Date();
  try {
    await db
      .promise()
      .query(`INSERT INTO daily_usage (phoneno, unit, time) VALUES (?, ?, ?)`, [
        phoneno,
        unit,
        currentDate,
      ]);
    console.log("Daily data inserted for weekly tracking");

    await db
      .promise()
      .query(`DELETE FROM weekly_usage WHERE phoneno = ?`, [phoneno]);

    console.log("Weekly data reset after insert");
  } catch (err) {
    console.error("Error inserting weekly data:", err);
  }
});

const insertYearly = asyncHandler(async (phoneno, unit) => {
  const currentDate = new Date();
  try {
    await db
      .promise()
      .query(
        `INSERT INTO monthly_usage (phoneno, unit, time) VALUES (?, ?, ?)`,
        [phoneno, unit, currentDate]
      );
    console.log("Monthly data inserted for yearly tracking");

    await db
      .promise()
      .query(`DELETE FROM yearly_usage WHERE phoneno = ?`, [phoneno]);

    console.log("Yearly data reset after insert");
  } catch (err) {
    console.error("Error inserting yearly data:", err);
  }
});

const resetDailyAtMidnight = asyncHandler(async (req, res, next) => {
  const now = new Date();
  const timeUntilMidnight =
    new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0) -
    now;

  setTimeout(() => {
    db.promise()
      .query(`DELETE FROM daily_usage`)
      .then(() => console.log("Daily usage table reset at midnight"))
      .catch((err) => console.error("Error resetting daily usage:", err));

    resetDailyAtMidnight();
  }, timeUntilMidnight);
});

const resetWeeklyAtMidnight = asyncHandler(async (req, res, next) => {
  const now = new Date();
  const timeUntilNextWeek =
    new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 0, 0, 0) -
    now;

  setTimeout(() => {
    db.promise()
      .query(`DELETE FROM weekly_usage`)
      .then(() => console.log("Weekly usage table reset after a week"))
      .catch((err) => console.error("Error resetting weekly usage:", err));

    resetWeeklyAtMidnight();
  }, timeUntilNextWeek);
});

const resetYearlyAtMidnight = asyncHandler(async (req, res, next) => {
  const now = new Date();
  const timeUntilNextYear =
    new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0) - now;

  setTimeout(() => {
    db.promise()
      .query(`DELETE FROM yearly_usage`)
      .then(() => console.log("Yearly usage table reset after a year"))
      .catch((err) => console.error("Error resetting yearly usage:", err));

    resetYearlyAtMidnight();
  }, timeUntilNextYear);
});

const startPeriodicUpdates = asyncHandler(async (req, res, next) => {
  const user = req?.user;
  const phoneno = user?.id;

  const [result] = await db
    .promise()
    .query("SELECT watt FROM client_dets WHERE phoneno = ?", [user.id]);

  if (result.length === 0) {
    return next(new ApiError(404, "No data found"));
  }

  const unit = result[0];

  setInterval(() => {
    insertHourly(phoneno, unit);
  }, 60 * 60 * 1000);

  setInterval(() => {
    insertWeekly(phoneno, unit);
  }, 7 * 24 * 60 * 60 * 1000);

  setInterval(() => {
    insertYearly(phoneno, unit);
  }, 365 * 24 * 60 * 60 * 1000);

  resetDailyAtMidnight();
  resetWeeklyAtMidnight();
  resetYearlyAtMidnight();
});

const retiveHourlyUsage = asyncHandler(async (req, res, next) => {
  const user = req?.user;

  if (!user) {
    return next(new ApiError(400, "User not authenticated"));
  }

  try {
    const [result] = await db
      .promise()
      .query(
        "SELECT unit, time FROM daily_usage WHERE phoneno = ? ORDER BY time ASC",
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
    const [result] = await db
      .promise()
      .query(
        "SELECT unit, time FROM weekly_usage WHERE phoneno = ? ORDER BY time ASC",
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
      .query("SELECT watt FROM client_dets WHERE phoneno = ?", [phoneno]);

    if (result.length === 0) {
      console.log("Client not found in database");
      return next(new ApiError(404, "Client not found"));
    }

    const watt = result[0].watt === null ? 0 : result[0].watt;
    console.log(`Current watt: ${watt}, calculating new watt...`);

    const newWatt = voltage * current + watt;

    console.log(`New watt value calculated: ${newWatt}`);

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
      .query("SELECT name, email, phoneno, role FROM users WHERE phoneno = ?", [
        req.user.id,
      ]);

    if (result.length === 0) {
      return next(new ApiError(404, "User not found"));
    }

    if (result[0].role === "Client") {
      const [resl] = await db
        .promise()
        .query("SELECT state FROM client_dets WHERE phoneno = ?", [
          req.user.id,
        ]);
      const { role, name, email, phoneno } = result[0];
      const { state } = resl[0];

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { name, email, phoneno, state, role },
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

const retrieveProfile = asyncHandler(async (req, res, next) => {
  const user = req?.user;

  if (!user) {
    return next(new ApiError(400, "Invalid Access"));
  }

  try {
    const userProfile = await User.findById(user._id).select('-password');

    if (!userProfile) {
      return next(new ApiError(404, "User not found"));
    }

    res.status(200).json({
      success: true,
      data: userProfile,
    });
  } catch (error) {
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
  deleteUser,
  startPeriodicUpdates,
  retrieveProfile
};
