import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const verifyToken = async (req, res, next) => {
  console.log("Cookies:", req.cookies);
  console.log("Headers:", req.headers);

  const token =
    req.cookies?.token ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null);

  console.log("Received Token:", token);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied",
    });
  }

  try {
    // const decoded = jwt.decode(token, process.env.JWT_SECRET);

    // if (decoded?.exp && decoded.exp * 1000 < Date.now()) {
    //   throw new Error("Token expired");
    // }

    // console.log("Decoded token:", jwt.decode(token));

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!decode.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please log in again.",
      });
    }

    const user = await userModel.findById(decode.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    req.userId = decode.id;
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. Please log in again.",
    });
  }
};

export default verifyToken;
