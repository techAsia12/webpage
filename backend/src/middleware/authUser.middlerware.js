import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHaldler.js';

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // Log the incoming request details for debugging
    console.log('Verifying JWT...');
    const token = req.cookies?.authToken || req.header("Authorization")?.replace("Bearer ", "");

    // Check if token is not provided
    if (!token) {
      console.log('No token found in request');
      return next(new ApiError(401, "Unauthorized request"));
    }

    // Check if token format is invalid
    if (typeof token !== 'string' || token.trim() === '') {
      console.log('Token format is invalid');
      return next(new ApiError(401, "Invalid token format"));
    }

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    
    // Log the decoded token if verification is successful
    console.log('Token successfully verified:', decodedToken);

    // Attach decoded token to the request object for further use
    req.user = decodedToken;

    console.log(req.user)
    next();
  } catch (error) {
    console.log('Error occurred during token verification:', error?.message || error);
    return next(new ApiError(401, error?.message || "Invalid Access Token"));
  }
});
