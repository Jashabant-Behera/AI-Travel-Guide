import PDFDocument from "pdfkit";
import { WritableStreamBuffer } from "stream-buffers";
import Itinerary from "../models/Itinerary.js";
import aiService from "../services/aiService.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";

const createAIItinerary = asyncHandler(async (req, res, next) => {
  const { location, preferences, days } = req.body;
  const userId = req.user._id;

  if (!location || !preferences || !days) {
    return next(new AppError("Location, preferences and days are required", 400));
  }

  if (!Array.isArray(preferences) || preferences.length === 0) {
    return next(new AppError("Preferences must be a non-empty array", 400));
  }

  if (days < 1 || days > 30) {
    return next(new AppError("Days must be between 1 and 30", 400));
  }

  const aiGeneratedText = await aiService.generateItinerary(location, preferences, days);

  if (!aiGeneratedText) {
    return next(new AppError("Failed to generate itinerary. Please try again", 500));
  }

  const itinerary = new Itinerary({
    user: userId,
    location: location.trim(),
    preferences,
    days,
    details: aiGeneratedText,
  });

  await itinerary.save();

  res.status(201).json({
    success: true,
    message: "Itinerary created successfully",
    itinerary,
  });
});

const getAllItineraries = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  
  const itineraries = await Itinerary.find({ user: req.userId })
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  const count = await Itinerary.countDocuments({ user: req.userId });

  res.json({
    success: true,
    itineraries,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    total: count
  });
});

const getItineraryById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return next(new AppError("Invalid itinerary ID", 400));
  }

  const itinerary = await Itinerary.findOne({
    _id: id,
    user: req.userId,
  });

  if (!itinerary) {
    return next(new AppError("Itinerary not found or you don't have permission", 404));
  }

  res.json({
    success: true,
    itinerary
  });
});

const updateItinerary = asyncHandler(async (req, res, next) => {
  const { location, dates, activities } = req.body;
  
  const itinerary = await Itinerary.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    { location, dates, activities },
    { new: true, runValidators: true }
  );
  
  if (!itinerary) {
    return next(new AppError("Itinerary not found or you don't have permission", 404));
  }
  
  res.json({
    success: true,
    message: "Itinerary updated successfully",
    itinerary
  });
});

const deleteItinerary = asyncHandler(async (req, res, next) => {
  const itinerary = await Itinerary.findOneAndDelete({ 
    _id: req.params.id, 
    user: req.userId 
  });
  
  if (!itinerary) {
    return next(new AppError("Itinerary not found or you don't have permission", 404));
  }
  
  res.json({ 
    success: true,
    message: "Itinerary deleted successfully" 
  });
});

const publicItinerary = asyncHandler(async (req, res, next) => {
  const itinerary = await Itinerary.findOne({
    _id: req.params.id,
    user: req.userId
  });
  
  if (!itinerary) {
    return next(new AppError("Itinerary not found or you don't have permission", 404));
  }

  itinerary.isPublic = !itinerary.isPublic;

  if (itinerary.isPublic) {
    itinerary.shareToken = Math.random().toString(36).substring(2, 10) + Date.now();
  } else {
    itinerary.shareToken = undefined;
  }
  
  await itinerary.save();
  
  res.json({
    success: true,
    message: `Itinerary is now ${itinerary.isPublic ? 'public' : 'private'}`,
    itinerary,
    shareToken: itinerary.shareToken || null,
  });
});

const getPublicItineraryByToken = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  
  if (!token) {
    return next(new AppError("Share token is required", 400));
  }

  const itinerary = await Itinerary.findOne({ 
    shareToken: token, 
    isPublic: true 
  }).populate('user', 'name');

  if (!itinerary) {
    return next(new AppError("Public itinerary not found or has been made private", 404));
  }

  res.json({ 
    success: true,
    itinerary 
  });
});

const exportItinerary = asyncHandler(async (req, res, next) => {
  const itinerary = await Itinerary.findById(req.params.id);

  if (!itinerary) {
    return next(new AppError("Itinerary not found", 404));
  }

  // Check if user owns the itinerary or if it's public
  if (itinerary.user.toString() !== req.userId && !itinerary.isPublic) {
    return next(new AppError("You don't have permission to export this itinerary", 403));
  }

  try {
    const doc = new PDFDocument();
    const bufferStream = new WritableStreamBuffer();

    doc.pipe(bufferStream);

    doc.fontSize(20).text(`Itinerary for ${itinerary.location}`, { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Days: ${itinerary.days}`);
    doc.moveDown();
    doc.fontSize(12).text(itinerary.details, { align: "left" });
    doc.end();

    bufferStream.on("finish", () => {
      const pdfData = bufferStream.getContents();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=itinerary-${itinerary._id}.pdf`);
      res.send(pdfData);
    });

    bufferStream.on("error", (error) => {
      return next(new AppError("Failed to generate PDF", 500));
    });
  } catch (error) {
    return next(new AppError("Failed to export itinerary", 500));
  }
});

export {
  createAIItinerary,
  getAllItineraries,
  getItineraryById,
  updateItinerary,
  deleteItinerary,
  publicItinerary,
  exportItinerary,
  getPublicItineraryByToken,
};
