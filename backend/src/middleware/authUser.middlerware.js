import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHaldler.js';

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.authToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return next(new ApiError(403, "Unauthorized request"));
    }

    if (typeof token !== 'string' || token.trim() === '') {
      return next(new ApiError(405, "Invalid token format"));
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decodedToken;

    next();
  } catch (error) {
    console.log('Error occurred during token verification:', error?.message || error);
    return next(new ApiError(406, error?.message || "Invalid Access Token"));
  }
});
