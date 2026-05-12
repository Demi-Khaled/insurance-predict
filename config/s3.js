const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const s3Storage = multerS3({
  s3: s3,
  bucket: process.env.AWS_BUCKET_NAME,
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    const fileName = `lesions/${Date.now().toString()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const lesionUploadS3 = multer({ storage: s3Storage });

module.exports = { s3, lesionUploadS3 };
