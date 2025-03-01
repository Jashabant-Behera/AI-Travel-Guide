const express = require("express");
const router = express.Router();
const Itinerary = require("../module/Itinerary");
const { verifyToken } = require("../middleware/auth");
const { createAIItinerary } = require("../controllers/itineraryController");

// Create Itinerary
router.post("/", verifyToken, async (req, res) => {
  try {
    const { location, dates, activities } = req.body;
    const itinerary = new Itinerary({
      user: req.user.id,
      location,
      dates,
      activities,
    });
    await itinerary.save();
    res.status(201).json(itinerary);
  } catch (err) {
    res.status(500).json({ error: "Error creating itinerary" });
  }
});

// Get All Itineraries for User
router.get("/", verifyToken, async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ user: req.user.id });
    res.json(itineraries);
  } catch (err) {
    res.status(500).json({ error: "Error fetching itineraries" });
  }
});

// Get Itinerary by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary)
      return res.status(404).json({ error: "Itinerary not found" });
    res.json(itinerary);
  } catch (err) {
    res.status(500).json({ error: "Error fetching itinerary" });
  }
});

// Update Itinerary
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { location, dates, activities } = req.body;
    const itinerary = await Itinerary.findByIdAndUpdate(
      req.params.id,
      { location, dates, activities },
      { new: true }
    );
    if (!itinerary)
      return res.status(404).json({ error: "Itinerary not found" });
    res.json(itinerary);
  } catch (err) {
    res.status(500).json({ error: "Error updating itinerary" });
  }
});

// Delete Itinerary
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const itinerary = await Itinerary.findByIdAndDelete(req.params.id);
    if (!itinerary)
      return res.status(404).json({ error: "Itinerary not found" });
    res.json({ message: "Itinerary deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting itinerary" });
  }
});

router.post("/ai", verifyToken, createAIItinerary);

module.exports = router;
