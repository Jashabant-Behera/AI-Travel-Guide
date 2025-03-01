const mongoose = require("mongoose");

const ItinerarySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  location: { type: String, required: true },
  dates: {
    start: { type: Date, required: true },
    end: { type: Date, required: true },
  },
  activities: [
    {
      name: { type: String, required: true },
      time: { type: String, required: true },
      description: { type: String },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Itinerary", ItinerarySchema);
