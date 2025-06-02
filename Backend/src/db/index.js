import mongoose from "mongoose";
import { dbname } from "../constant.js";

const connectdb = async () => {
  try {
    const dbinstance = await mongoose.connect(`${process.env.dblink}${dbname}`);

    console.log(`mongodb connect to hostname:${dbinstance.connection.host}`);
  } catch (error) {
    console.log("error is found", error);
    process.exit(1);
  }
};
export { connectdb };
