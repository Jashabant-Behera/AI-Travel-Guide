import userModel from "../models/userModel.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";

export const updateUser = asyncHandler(async (req, res, next) => {
  const { name, gender, userLocation, profileImage, bannerImage } = req.body;
  const userId = req.user._id;

  const updateData = {};
  if (name !== undefined) {
    if (name.trim() === "") {
      return next(new AppError("Name cannot be empty", 400));
    }
    updateData.name = name.trim();
  }
  if (gender !== undefined) {
    if (!["Male", "Female", "Others", ""].includes(gender)) {
      return next(new AppError("Invalid gender value", 400));
    }
    updateData.gender = gender;
  }
  if (userLocation !== undefined) updateData.userLocation = userLocation.trim();
  if (profileImage !== undefined) updateData.profileImage = profileImage;
  if (bannerImage !== undefined) updateData.bannerImage = bannerImage;

  if (Object.keys(updateData).length === 0) {
    return next(new AppError("No fields to update", 400));
  }

  const updatedUser = await userModel
    .findByIdAndUpdate(userId, { $set: updateData }, { new: true, runValidators: true })
    .select(
      "name email gender userLocation profileImage bannerImage isAccountVerified createdAt savedItineraries"
    );

  if (!updatedUser) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: updatedUser,
  });
});
