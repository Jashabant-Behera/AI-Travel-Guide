import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: { 
    type: String, 
    required: [true, "Name is required"],
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, "Email is required"], 
    unique: true,
    lowercase: true,
    trim: true,
    index: true // Add index
  },
  password: { 
    type: String, 
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"]
  },
  gender: { 
    type: String, 
    enum: ["Male", "Female", "Others", ""],
    default: "" 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  preferences: { 
    type: Array, 
    default: [] 
  },
  savedItineraries: { 
    type: Array, 
    default: [] 
  },
  verifyOTP: { 
    type: String, 
    default: "" 
  },
  verifyOTPExpireAt: { 
    type: Number, 
    default: 0 
  },
  isAccountVerified: { 
    type: Boolean, 
    default: false 
  },
  resetOTP: { 
    type: String, 
    default: "" 
  },
  resetOTPExpireAt: { 
    type: Number, 
    default: 0 
  },
  userLocation: { 
    type: String, 
    default: "",
    trim: true 
  },
  profileImage: { 
    type: String, 
    default: "/profiles/avatar1.png" 
  },
  bannerImage: { 
    type: String, 
    default: "/banners/banner1.jpg" 
  },
}, {
  timestamps: true
});

export default model("userModel", userSchema);
