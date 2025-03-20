import { config } from "dotenv";
config();

import { connect } from "mongoose";

const connectDB = async () => {
  try {
    await connect(process.env.MONGO_URI);
    console.log("MongoDB Connected to Database:", process.env.MONGO_URI.split('/').pop().split('?')[0]);
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;