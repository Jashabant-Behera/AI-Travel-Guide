import aiService from "../services/aiService.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";

const getRecommendation = asyncHandler(async (req, res, next) => {
  const { location, preferences } = req.body;

  if (!location || !preferences || preferences.length === 0) {
    return next(new AppError("Location and preferences are required", 400));
  }

  if (!Array.isArray(preferences)) {
    return next(new AppError("Preferences must be an array", 400));
  }

  const recommendation = await aiService.getRecommendations(location, preferences);

  if (!recommendation) {
    return next(new AppError("Failed to generate recommendations. Please try again", 500));
  }

  res.status(200).json({
    success: true,
    message: "Recommendation generated successfully",
    recommendation,
    timestamp: new Date(),
  });
});

export { getRecommendation };