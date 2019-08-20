require('dotenv').config();
const upload = {
  UPLOAD_LOCATION: process.env.UPLOAD_LOCATION,
  UPLOAD_FILESIZE: parseInt(process.env.UPLOAD_FILESIZE), // MB
  UPLOAD_MAX_COUNT: parseInt(process.env.UPLOAD_MAX_COUNT),
  UPLOAD_FILE_EXTENSION: process.env.UPLOAD_FILE_EXTENSION.split(','),
}
module.exports = upload
