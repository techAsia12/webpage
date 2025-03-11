import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHaldler.js';

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.authToken || req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return next(new ApiError(403, "Unauthorized request: Token missing"));
    }

    if (token.trim() === '') {
      return next(new ApiError(405, "Invalid token format: Token cannot be empty"));
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decodedToken;

    next();
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error during JWT verification:', error?.message || error);
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return next(new ApiError(406, "Invalid Access Token: " + (error.message || 'Token verification failed')));
    }

    return next(new ApiError(500, "An error occurred during token verification"));
  }
});