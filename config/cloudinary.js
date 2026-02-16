const cloudinary = require('cloudinary').v2;
const logger = require('../utils/logger');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload image
exports.uploadImage = async (filePath, folder = 'school-mis') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'auto',
      transformation: [
        { width: 500, height: 500, crop: 'limit' },
        { quality: 'auto' }
      ]
    });

    logger.info(`Image uploaded to Cloudinary: ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    logger.error(`Cloudinary Upload Error: ${error.message}`);
    throw error;
  }
};

// Delete image
exports.deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    logger.info(`Image deleted from Cloudinary: ${publicId}`);
    return result;
  } catch (error) {
    logger.error(`Cloudinary Delete Error: ${error.message}`);
    throw error;
  }
};

// Upload document
exports.uploadDocument = async (filePath, folder = 'school-mis/documents') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'auto'
    });

    logger.info(`Document uploaded to Cloudinary: ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    logger.error(`Cloudinary Upload Error: ${error.message}`);
    throw error;
  }
};

module.exports = cloudinary;

