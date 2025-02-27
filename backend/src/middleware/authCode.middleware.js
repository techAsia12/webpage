import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHaldler.js";
import jwt from "jsonwebtoken";

export const verifyCode = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.authCode || req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      console.log("Token missing");
      return next(new ApiError(403, "Unauthorized request: Verification code missing"));
    }

    if (token.trim() === '') {
      console.log("Token cannot be empty");
      return next(new ApiError(405, "Invalid token format: Token cannot be empty"));
    }

    const code = await jwt.verify(token, process.env.JWT_SECRET);
    const { verificationCode } = req.body;
    console.log(`Received code from params: ${code}`);
    console.log(`Received verified code from body: ${verificationCode}`);

    if (code !== verificationCode) {
      console.error("Invalid verification code.");
      return next(new ApiError(400, "Invalid Verification code"));
    }

    console.log("Verification code matched successfully.");
    return res.status(200).json(new ApiResponse(200,"Code Verified Successfully"));
  } catch (error) {
    console.error("Error during verification:", error);
    return next(new ApiError(500, "Internal Server Error"));
  }
});