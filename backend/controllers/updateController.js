import userModel from "../models/userModel.js";

export const updateUser = async (req, res) => {
  try {
    const { name, gender, userLocation, profileImage, bannerImage } = req.body;
    const userId = req.user._id;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (gender !== undefined) updateData.gender = gender;
    if (userLocation !== undefined) updateData.userLocation = userLocation;
    if (profileImage !== undefined) updateData.profileImage = profileImage;
    if (bannerImage !== undefined) updateData.bannerImage = bannerImage;

    const updatedUser = await userModel
      .findByIdAndUpdate(userId, { $set: updateData }, { new: true, runValidators: true })
      .select(
        "name email gender userLocation profileImage bannerImage isAccountVerified createdAt savedItineraries"
      );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
