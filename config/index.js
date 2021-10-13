const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
  reportsPhotoFolder: process.env.REPORTS_PHOTO_FOLDER,
  reportsPhotoFolder: process.env.PRODUCTS_PHOTO_FOLDER,
  secret: process.env.SECRET
};