import mongoose from "mongoose";
import { dbname } from "../constant.js";

const connectdb = async () => {
  try {
    const dbinstance = await mongoose.connect(`${process.env.dblink}${dbname}`);

    console.log(`MongoDB connected. Host: ${dbinstance.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};
export { connectdb };
