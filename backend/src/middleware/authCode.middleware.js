import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHaldler.js";

export const verifyCode = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.code || req.header("Authorization")?.replace("Bearer ", "");
    
    console.log("Token:", token); 

    if (!token) {
      console.log("Token missing");
      return next(new ApiError(403, "Unauthorized request: Verification code missing"));
    }

    if (token.trim() === '') {
      console.log("Token cannot be empty");
      return next(new ApiError(405, "Invalid token format: Token cannot be empty"));
    }

    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decodedToken); 

    req.code = decodedToken;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError(401, "Token has expired"));
    }

    if (error.name === 'JsonWebTokenError') {
      return next(new ApiError(401, "Invalid token"));
    }

    return next(new ApiError(500, "Internal Server Error"));
  }
});