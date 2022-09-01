// require("dotenv").config({ path: "../.env" });
// const mongoose = require("mongoose");
import mongoose from "mongoose";
import {} from "dotenv/config";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModify: true,
    });
    console.log("MongoDB connection SUCCESSFUL");
  } catch (err) {
    console.error("MongoDB connection FAILED");
  }
};

// module.exports = connectDB;
export default connectDB;
