import { Schema, model } from "mongoose";

const ItinerarySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  location: { type: String, required: true },
  days:{type: Number, required: true},
  dates: {
    start: { type: Date },
    end: { type: Date },
  },
  details: { type: String },
  isPublic: { type: Boolean, default: false },
  shareToken: { type: String, unique: true, sparse: true },
  createdAt: { type: Date, default: Date.now },
});

export default model("Itinerary", ItinerarySchema);