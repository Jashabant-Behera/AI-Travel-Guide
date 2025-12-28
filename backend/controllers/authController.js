import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";
import {
  EMAIL_VERIFY_TEMPLATE,
  PASSWORD_RESET_TEMPLATE,
  WELCOME_TEMPLATE,
} from "../config/emailTemplates.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";

export const signup = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new AppError("Name, email and password are required", 400));
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(new AppError("Please provide a valid email address", 400));
  }

  // Validate password strength
  if (password.length < 6) {
    return next(new AppError("Password must be at least 6 characters long", 400));
  }

  const existingUser = await userModel.findOne({ email });

  if (existingUser) {
    return next(new AppError("User already exists with this email", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new userModel({ name, email, password: hashedPassword });

  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // Send welcome email
  try {
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to AI Travel Buddy",
      html: WELCOME_TEMPLATE.replace("{{username}}", user.name),
    };

    await transporter.sendMail(mailOptions);
  } catch (emailError) {
    console.error("Failed to send welcome email:", emailError);
    // Don't fail registration if email fails
  }

  return res.status(201).json({ 
    success: true, 
    message: "Successfully Registered",
    token 
  });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Email and password are required", 400));
  }

  const user = await userModel.findOne({ email });

  if (!user) {
    return next(new AppError("Invalid email or password", 401));
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return next(new AppError("Invalid email or password", 401));
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    success: true,
    message: "Successfully Logged In",
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      gender: user.gender,
      location: user.userLocation,
      userLocation: user.userLocation,
      profileImage: user.profileImage,
      bannerImage: user.bannerImage,
      isAccountVerified: user.isAccountVerified,
      savedItineraries: user.savedItineraries,
      createdAt: user.createdAt,
    },
  });
});

export const logout = asyncHandler(async (req, res, next) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  });

  return res.status(200).json({ success: true, message: "Logged Out" });
});

export const sendOTP = asyncHandler(async (req, res, next) => {
  const { userId } = req;

  const user = await userModel.findById(userId);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (user.isAccountVerified) {
    return next(new AppError("Account is already verified", 400));
  }

  const OTP = String(Math.floor(100000 + Math.random() * 900000));

  user.verifyOTP = OTP;
  user.verifyOTPExpireAt = Date.now() + 24 * 60 * 60 * 1000;

  await user.save();

  try {
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", OTP).replace("{{email}}", user.email),
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "Verification OTP sent to your email",
    });
  } catch (emailError) {
    // Rollback OTP if email fails
    user.verifyOTP = "";
    user.verifyOTPExpireAt = 0;
    await user.save();
    
    return next(new AppError("Failed to send verification email. Please try again later", 500));
  }
});

export const verifyEmail = asyncHandler(async (req, res, next) => {
  const userId = req.userId;
  const { OTP } = req.body;

  if (!userId || !OTP) {
    return next(new AppError("User ID and OTP are required", 400));
  }

  const user = await userModel.findById(userId);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (user.isAccountVerified) {
    return next(new AppError("Account is already verified", 400));
  }

  if (!user.verifyOTP || user.verifyOTP === "") {
    return next(new AppError("No OTP found. Please request a new one", 400));
  }

  if (user.verifyOTP !== OTP) {
    return next(new AppError("Invalid OTP", 400));
  }

  if (user.verifyOTPExpireAt < Date.now()) {
    return next(new AppError("OTP has expired. Please request a new one", 400));
  }

  user.isAccountVerified = true;
  user.verifyOTP = "";
  user.verifyOTPExpireAt = 0;

  await user.save();
  
  return res.status(200).json({ 
    success: true, 
    message: "Email verified successfully" 
  });
});

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  const { userId } = req;

  if (!userId) {
    return next(new AppError("User not authenticated", 401));
  }

  const user = await userModel.findById(userId);
  
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (!user.isAccountVerified) {
    return res.status(200).json({ 
      success: false, 
      message: "Account not verified",
      isVerified: false 
    });
  }

  return res.status(200).json({ 
    success: true, 
    message: "User is authenticated",
    isVerified: true 
  });
});

export const resetOTP = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError("Email is required", 400));
  }

  const user = await userModel.findOne({ email });
  
  if (!user) {
    return next(new AppError("No account found with this email", 404));
  }

  const OTP = String(Math.floor(100000 + Math.random() * 900000));

  user.resetOTP = OTP;
  user.resetOTPExpireAt = Date.now() + 15 * 60 * 1000; // 15 minutes

  await user.save();

  try {
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", OTP).replace("{{email}}", user.email),
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ 
      success: true, 
      message: "Password reset OTP sent to your email" 
    });
  } catch (emailError) {
    // Rollback OTP if email fails
    user.resetOTP = "";
    user.resetOTPExpireAt = 0;
    await user.save();
    
    return next(new AppError("Failed to send reset email. Please try again later", 500));
  }
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, OTP, newPassword } = req.body;

  if (!email || !OTP || !newPassword) {
    return next(new AppError("Email, OTP, and new password are required", 400));
  }

  if (newPassword.length < 6) {
    return next(new AppError("Password must be at least 6 characters long", 400));
  }

  const user = await userModel.findOne({ email });
  
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (!user.resetOTP || user.resetOTP === "") {
    return next(new AppError("No reset request found. Please request a new OTP", 400));
  }

  if (user.resetOTP !== OTP) {
    return next(new AppError("Invalid OTP", 400));
  }

  if (user.resetOTPExpireAt < Date.now()) {
    return next(new AppError("OTP has expired. Please request a new one", 400));
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.resetOTP = "";
  user.resetOTPExpireAt = 0;

  await user.save();
  
  return res.status(200).json({ 
    success: true, 
    message: "Password reset successfully" 
  });
});

export const getUserData = asyncHandler(async (req, res, next) => {
  const userId = req.userId;

  if (!userId) {
    return next(new AppError("User ID is required", 400));
  }

  const user = await userModel
    .findById(userId)
    .select(
      "name email gender userLocation profileImage bannerImage isAccountVerified savedItineraries createdAt"
    );

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  return res.json({ success: true, user: user });
});

export const verifySession = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.body.userId);
  
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  
  return res.status(200).json({ 
    success: true, 
    user: { 
      id: user._id, 
      name: user.name, 
      email: user.email 
    } 
  });
});
