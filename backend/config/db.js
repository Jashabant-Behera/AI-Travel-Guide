const mongoose = require("mongoose");
require("dotenv").config({ path: "../config/.env" });

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URI, {
      dbName: "travelGuideAI",
    });

    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
