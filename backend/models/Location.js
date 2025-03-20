import { Schema, model } from "mongoose";

const LocationSchema = new Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String },
  description: { type: String },
  category: {
    type: String,
    enum: ["Cultural", "Nature", "Food", "Adventure"],
    required: true,
  },
  images: [String],
  latitude: { type: Number },
  longitude: { type: Number },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [0, 0] },
  },
});

LocationSchema.index({ location: "2dsphere" });

export default model("Location", LocationSchema);
