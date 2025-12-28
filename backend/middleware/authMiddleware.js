import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import { AppError } from "./errorHandler.js";

const verifyToken = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return next(new AppError("Access denied. Please log in", 401));
    }

    let decode;
    try {
      decode = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return next(new AppError("Your session has expired. Please log in again", 401));
      }
      return next(new AppError("Invalid token. Please log in again", 401));
    }

    if (!decode.id) {
      return next(new AppError("Invalid token payload. Please log in again", 401));
    }

    const user = await userModel.findById(decode.id).select("-password");

    if (!user) {
      return next(new AppError("User no longer exists. Please sign up again", 404
));
    }

    req.userId = decode.id;
    req.user = user;
    next();
  } catch (error) {
    return next(new AppError("Authentication failed. Please log in again", 401));
  }
};

export default verifyToken;
