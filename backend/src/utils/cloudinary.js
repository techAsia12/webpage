import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import dotenv from "dotenv";
import path from 'path';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            console.log(" No file path provided for upload.");
            return null;
        }

        const fileName = path.basename(localFilePath, path.extname(localFilePath));
        console.log(` Uploading file: ${localFilePath}`);
        console.log(` Cloudinary Public ID: ${fileName}`);

        const response = await cloudinary.uploader.upload(localFilePath, {
            public_id: fileName,
            overwrite: true,
            resource_type: "auto",
        });

        console.log("Upload Successful! Cloudinary Response:", response);

        // Delete local file after successful upload
        fs.unlinkSync(localFilePath);
        console.log(` Deleted local file: ${localFilePath}`);

        return response;
    } catch (error) {
        console.error(" Cloudinary Upload Error:", error);

        // Ensure local file is deleted even if upload fails
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
            console.log(` Deleted local file after failure: ${localFilePath}`);
        }

        return null;
    }
}

export { uploadOnCloudinary };
 