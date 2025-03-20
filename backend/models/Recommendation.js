import { Schema, model } from "mongoose";

const RecommendationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  category: {
    type: String,
    enum: ["Food", "Cultural", "HiddenGem", "AI Generated"],
    required: true,
  },
  location: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
});

export default model("Recommendation", RecommendationSchema);