import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect("mongodb://127.0.0.1:27017/pet-adoption");
    console.log("MongoDB connected successfully: DB host: ", connectionInstance.connection.host);
  } catch (err) {
    console.log("MongoDB connection error ", err);
    process.exit(1);
  }
};

export default connectDB;   