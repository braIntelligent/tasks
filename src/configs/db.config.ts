import mongoose from "mongoose";
import "dotenv/config";

export const connectionToDatabase = () => {
  const conn = mongoose.connect(process.env.MONGODB_URI as string);
  console.log("connect to database");
};
