import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHaldler.js";

export const verifyCode=asyncHandler(async(req,res,next)=>{
  try {
    const {code}=req.param;
    const {veriferdCode}=req.body;

    if(code!== veriferdCode){
      next(new ApiError(400,"Invalid Verification code"));
    }

    next();
  } catch (error) {
     next(new ApiError(500,"Internal Server Error"));
  }
});