import { v2 as cloudinary } from 'cloudinary';
import type { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import slugify from 'slugify';


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Helper function to upload a single file to Cloudinary
export const uploadFileToCloudinary = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise<string>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'ecommerce/products' },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Unknown Cloudinary upload error'));
        } else {
          resolve(result.secure_url);
        }
      }
    );
    uploadStream.end(buffer);
  });
};

export const deleteFileFromCloudinary = async (url: string): Promise<void> => {
  try {
    // Regex để trích xuất public_id, bao gồm cả folder
    const regex = /ecommerce\/products\/([^\/.]+)/;
    const match = url.match(regex);

    if (match && match[1]) {
      const publicId = `ecommerce/products/${match[1]}`;
      await cloudinary.uploader.destroy(publicId);
      console.log(`Successfully deleted image with public_id: ${publicId}`);
    } else {
      console.warn(`Could not extract public_id from URL: ${url}. Skipping deletion.`);
    }
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
    throw error;
  }
};