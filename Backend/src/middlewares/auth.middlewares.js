import {User} from "../models/users.model.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

const verifyJWT = asyncHandler( async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(401, "Unauthorized Access1");
    }

    const decodeToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );
    if (!decodeToken) {
      throw new ApiError(401, "Invalid Access Token");
    }

    const user = await User.findById(decodeToken?._id).select(" -password -refreshToken ");

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;

    next();
  } catch (error) {
    throw new ApiError(401, error.message || "Invalid Token");
  }
});

export {verifyJWT}