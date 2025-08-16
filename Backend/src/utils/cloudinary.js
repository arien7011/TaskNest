import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env", // This won't work from /src
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const uploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) return null;
    const cloudinaryResponse = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });
    if (cloudinaryResponse) {
      console.log(
        `File upload on cloudinary .File src: ${cloudinaryResponse.url}`
      );
      fs.unlinkSync(filePath);
      return cloudinaryResponse;
    }
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    fs.unlinkSync(filePath);
    return null;
  }
};

const removeFileFromCloudinary = async (public_id) => {
  try {
    if (!public_id) return null;
    const response = await cloudinary.uploader.destroy(public_id);
    return response;
  } catch (error) {
    console.log(500, "Error while deleting file from cloudinary");
  }
};

export { uploadOnCloudinary,removeFileFromCloudinary };
