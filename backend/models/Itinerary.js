import { Schema, model } from "mongoose";

const ItinerarySchema = new Schema({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true,
    index: true // Add index for faster queries
  },
  location: { 
    type: String, 
    required: [true, "Location is required"],
    trim: true 
  },
  days: { 
    type: Number, 
    required: [true, "Number of days is required"],
    min: [1, "Days must be at least 1"]
  },
  dates: {
    start: { type: Date },
    end: { type: Date },
  },
  details: { 
    type: String,
    required: [true, "Itinerary details are required"]
  },
  isPublic: { 
    type: Boolean, 
    default: false 
  },
  shareToken: { 
    type: String, 
    unique: true, 
    sparse: true,
    index: true // Add index for faster lookups
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true // Add index for sorting
  },
}, {
  timestamps: true // Automatically manage createdAt and updatedAt
});

// Add compound index for user queries
ItinerarySchema.index({ user: 1, createdAt: -1 });

export default model("Itinerary", ItinerarySchema);