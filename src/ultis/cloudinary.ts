import { v2 as cloudinary } from 'cloudinary';
import type { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import slugify from 'slugify';


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Helper function to upload a single file to Cloudinary
export const uploadFileToCloudinary = async (file: File, folder: string, subId: string): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const publicId = `ecommerce/${folder}/${subId}/${slugify(file.name, { lower: true, strict: true })}`;

  return new Promise<string>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { public_id: publicId, overwrite: true },
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

export const deleteFileFromCloudinary = async (url: string, folder: string): Promise<void> => {
  try {
    // Regex để trích xuất public_id, bao gồm cả folder
    const regex = `/ecommerce\/${folder}\/([^\/.]+)/`;
    const match = url.match(regex);

    if (match && match[1]) {
      const publicId = `ecommerce/${folder}/${match[1]}`;
      await cloudinary.uploader.destroy(publicId);
    } else {
      console.warn(`Could not extract public_id from URL: ${url}. Skipping deletion.`);
    }
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
    throw error;
  }
};


export const deleteFolderFromCloudinary = async (
  mainFolder: string,
  subId: string
): Promise<void> => {
  try {
    // Construct the folder path to be deleted
    const folderPath = `ecommerce/${mainFolder}/${subId}`;

    // Use the `delete_resources_by_prefix` method to delete all resources in the folder
    // The `folder` option ensures the folder itself is also deleted
    const result = await cloudinary.api.delete_resources_by_prefix(folderPath, {
    invalidate: true, // Xóa cache CDN
    all: true, // Thêm tùy chọn này để xóa tất cả các file
    });
    
    // Nếu bạn muốn xóa cả thư mục rỗng sau khi đã xóa hết file
    // Có thể dùng delete_folder, nhưng api.delete_resources_by_prefix với option 'all' thường đủ
    await cloudinary.api.delete_folder(folderPath);

  } catch (error) {
    console.error('Error deleting folder from Cloudinary:', error);
    throw error;
  }
};