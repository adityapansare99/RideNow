import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

const uploadoncloudinary = async (filepath) => {
  try {
    if (!filepath) return null;

    const response = await cloudinary.uploader.upload(filepath, {
      resource_type: "auto",
    });

    fs.unlink(filepath, (err) => {
      if (err) {
        console.log("Failed to delete temp file:", err);
      } else {
        console.log("Temp file deleted from local storage");
      }
    });
    console.log("Successfully uploaded to Cloudinary:", response.url);

    return response;
  } catch (err) {
    fs.unlink(filepath, (err) => {
      if (err) {
        console.log("Failed to delete temp file:", err);
      } else {
        console.log("Temp file deleted from local storage");
      }
    });
    return null;
  }
};

const deletefromcloudinary = async (id) => {
  try {
    const response = await cloudinary.uploader.destroy(id);
    console.log("Deleted successfully from Cloudinary:", response);
  } catch (err) {
    console.log("Error in deleting the file", err);
    return null;
  }
};

export { uploadoncloudinary, deletefromcloudinary };
