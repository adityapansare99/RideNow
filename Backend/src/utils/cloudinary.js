import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

const uploadoncloudinary = async (filepath) => {
  if (!fs.existsSync(filepath)) {
    console.log("File not found:", filepath);
  } else {
    console.log("file found");
  }
  try {
    console.log("reach to file");
    if (!filepath) return null;

    const response = await cloudinary.uploader.upload(filepath, {
      resource_type: "auto",
    });

    console.log("successfully uploaded to cloudinary" + response.url);

    console.log("check0");

    fs.unlink(filepath, (err) => {
      if (err) {
        console.log("File not deleted from local storage:", err);
      } else {
        console.log("File deleted from local storage");
      }
    });

    return response;
  } catch (err) {
    fs.unlink(filepath, (err) => {
      if (err) {
        console.log("File not deleted from local storage:", err);
      } else {
        console.log("File deleted from local storage");
      }
    });
    console.log("fail to upload");
    return null;
  }
};

const deletefromcloudinary = async (id) => {
  try {
    const response = await cloudinary.uploader.destroy(id);
    console.log("delted successfully", response);
  } catch (err) {
    console.log("error in deleting the file", err);
    return null;
  }
};

export { uploadoncloudinary, deletefromcloudinary };
