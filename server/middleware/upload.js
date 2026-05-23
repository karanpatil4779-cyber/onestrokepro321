const multer = require('multer');
const path = require('path');
const cloudinary = require('../config/cloudinary');

const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

let upload;

if (isCloudinaryConfigured) {
  const { CloudinaryStorage } = require('multer-storage-cloudinary');
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'onestroke_docs',
      allowed_formats: ['jpg', 'png', 'pdf'],
    },
  });
  upload = multer({ storage });
  console.log('Upload middleware using Cloudinary storage');
} else {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(__dirname, '..', 'uploads');
      const fs = require('fs');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });
  upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });
  console.warn('Upload middleware using local disk storage (Cloudinary not configured)');
}

module.exports = upload;
