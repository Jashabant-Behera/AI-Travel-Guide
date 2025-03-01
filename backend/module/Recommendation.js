const mongoose = require("mongoose");

const RecommendationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: {
    type: String,
    enum: ["Food", "Cultural", "HiddenGem", "AI Generated"],
    required: true,
  },
  location: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, maxlength: 500 }, // Added maximum length constraint
  rating: { type: Number, min: 1, max: 5, required: true }, // Made rating required
  createdAt: { type: Date, default: Date.now }, // Added createdAt timestamp
  updatedAt: { type: Date, default: Date.now }, // Added updatedAt timestamp
});

module.exports = mongoose.model("Recommendation", RecommendationSchema);
