import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHaldler.js";

const verifyCode = asyncHandler(async (req, res, next) => {
    const { code } = req.query;
    const { veriferdCode } = req.body;
  
    try {
      if (code !== veriferdCode) {
        return next(new ApiError(400, "Wrong verification code"));
      }
  
      return next();
    } catch (err) {
      return next(new ApiError(400, "An error occurred while verifying the code"));
    }
  });
  
export {verifyCode};