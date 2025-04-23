import express from "express";
import cors from "cors";
import { config } from "dotenv";
config();
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import itineraryRoutes from "./routes/itineraryRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";

const app = express();

connectDB();

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production" ? process.env.CORS_ORIGIN : "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("AI-Powered Travel Guide API is running");
});
app.use("/api/auth", authRoutes);
app.use("/api/itinerary", itineraryRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/ai", chatbotRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || "Something went wrong!" });
});

process.removeAllListeners("warning");

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
});
