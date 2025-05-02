import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  preferences: { type: Array, default: [] },
  savedItineraries: { type: Array, default: [] },
  verifyOTP: { type: String, default: "" },
  verifyOTPExpireAt: { type: Number, default: 0 },
  isAccountVerified: { type: Boolean, default: false },
  resetOTP: { type: String, default: "" },
  resetOTPExpireAt: { type: Number, default: 0 },
  userLocation: { type: String, default: "" },
});

export default model("userModel", userSchema);
