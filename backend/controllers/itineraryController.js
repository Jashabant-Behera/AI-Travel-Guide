import PDFDocument from "pdfkit";
import { WritableStreamBuffer } from "stream-buffers";
import Itinerary from "../models/Itinerary.js";
import aiService from "../services/aiService.js";

const createAIItinerary = async (req, res) => {
  try {
    const { location, preferences, days } = req.body;
    const userId = req.user._id;

    if (!location || !preferences || !days) {
      return res.status(400).json({
        error: "Location, preferences and days are required",
        received: req.body,
      });
    }

    const aiGeneratedText = await aiService.generateItinerary(location, preferences, days);

    const itinerary = new Itinerary({
      user: userId,
      location,
      preferences,
      days,
      details: aiGeneratedText,
    });

    await itinerary.save();

    res.status(201).json({
      message: "Itinerary created successfully",
      itinerary,
    });
  } catch (error) {
    res.status(500).json({
      error: "Complete error details",
      message: error.message,
      stack: error.stack,
    });
  }
};

const getAllItineraries = async (req, res) => {
  try {


    const itineraries = await Itinerary.find({ user: req.userId }).sort({ createdAt: -1 });


    res.json(itineraries);
  } catch (err) {
    console.error("Error in getAllItineraries:", err);
    res.status(500).json({
      error: "Error fetching itineraries",
      details: err.message,
    });
  }
};

const getItineraryById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching itinerary ${id} for user ${req.userId}`);

    const itinerary = await Itinerary.findOne({
      _id: id,
      user: req.userId,
    });

    if (!itinerary) {
      console.log("Itinerary not found or access denied");
      return res.status(404).json({
        error: "Itinerary not found or you don't have permission",
      });
    }

    res.json(itinerary);
  } catch (err) {
    console.error("Error in getItineraryById:", err);
    res.status(500).json({
      error: "Error fetching itinerary",
      details: err.message,
    });
  }
};

const updateItinerary = async (req, res) => {
  try {
    const { location, dates, activities } = req.body;
    const itinerary = await Itinerary.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { location, dates, activities },
      { new: true }
    );
    if (!itinerary) return res.status(404).json({ error: "Itinerary not found" });
    res.json(itinerary);
  } catch (err) {
    res.status(500).json({ error: "Error updating itinerary" });
  }
};

const deleteItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!itinerary) return res.status(404).json({ error: "Itinerary not found" });
    res.json({ message: "Itinerary deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting itinerary" });
  }
};

const publicItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary) {
      return res.status(400).json({ message: "Itinerary not Found" });
    }

    itinerary.isPublic = !itinerary.isPublic;

    if (itinerary.isPublic) {
      itinerary.shareToken = Math.random().toString(36).substring(2, 10) + Date.now();
    } else if (!itinerary.isPublic) {
      itinerary.shareToken = undefined;
    }
    await itinerary.save();
    res.json({
      message: "Itinerary public status updated",
      itinerary,
      shareToken: itinerary.shareToken || "null",
    });
  } catch (error) {
    console.error("Error toggling itinerary public status:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getPublicItinerary = async (req, res) => {
  try {
    const { token } = req.params;
    const itinerary = await Itinerary.findOne({ shareToken: token, isPublic: true });

    if (!itinerary) {
      return res.status(404).json({ message: "Public itinerary not found" });
    }

    return res.json({ itinerary });
  } catch (error) {
    console.error("Error fetching public itinerary:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const exportItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

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
  } catch (error) {
    console.error("Error exporting itinerary PDF:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getPublicItineraryByToken = async (req, res) => {
  try {
    const { token } = req.params;
    const itinerary = await Itinerary.findOne({ shareToken: token, isPublic: true });

    if (!itinerary) {
      return res.status(404).json({ message: "Public itinerary not found" });
    }

    return res.json({ itinerary });
  } catch (error) {
    console.error("Error fetching public itinerary by token:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export {
  createAIItinerary,
  getAllItineraries,
  getItineraryById,
  updateItinerary,
  deleteItinerary,
  publicItinerary,
  getPublicItinerary,
  exportItinerary,
  getPublicItineraryByToken,
};
