const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

aws.config.update({
  secretAccessKey: process.env.AWS_SECRETKEY,
  accessKeyId: process.env.AWS_ACCESSKEY,
  region: process.env.AWS_REGION_NAME
});

const s3 = new aws.S3();

let supportedFormats = [
  'application/pdf',
  'application/msword',
  'text/plain',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/csv',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/yaml',
  'text/x-yaml',
  'application/x-yaml',
  'application/zip',
  'application/octet-stream',
  'image/jpeg',
  'image/jpg',
  'image/png'
];

const fileFilter = (req, file, cb) => {
  cb(null, true);
  if (req.query.type === 'document') {
    if (supportedFormats.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type, only PNG, JPG, JPEG, PDF, DOC, DOCX, TXT, CSV, XLSX, XLS, YAML, PPT and PPTX is allowed'), false);
    }
  } else {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type, only JPG, JPEG and PNG is allowed'), false);
    }
  }
}

module.exports = {
  uploadFile: function (req, res, key, callback) {
    let file_size = 1024 * 1024 * 1; // logo image max size 1 MB
    if (req.query.type === 'document') {
      file_size = 1024 * 1024 * 100;
    }

    // upload file validations and name changes
    const upload = multer({
      fileFilter,
      limits:{
        files: 1, // allow only 1 file per request
        fileSize: parseInt(file_size)
      },
      storage: multerS3({
        acl: 'public-read',
        s3,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        bucket: process.env.AWS_BUCKET_NAME,
        metadata: function (req, file, cb) {
          cb(null, {fieldName: 'TESTING_METADATA'});
        },
        key: function (req, file, cb) {
          let path = '';

          if (file.mimetype === 'application/vnd.ms-excel' &&
            file.originalname.split('.').pop() === 'csv') {
            file.mimetype = 'text/csv';
          } // update the file mimetype if it is uploaded through windows os browser.

          let filename = Date.now().toString()+'.'+file.originalname.split('.').pop();
          if (req.query.module) {
            let dir_path = process.env.AWS_DIRECTORY_PATH;
            dir_path = dir_path.substring(0, dir_path.indexOf("/")) + `/${req.query.module}/`;
            path = dir_path + filename;
          } else {
            path = process.env.AWS_DIRECTORY_PATH + filename;
          }
          cb(null, path);
        }
      })
    });
    const singleUpload = upload.single(key);
    singleUpload(req, res, function(err) {
      if (err) {
        callback({error: err.message});
      } else {
        if (req.file) {
          callback(null, {url: req.file.location, key: req.file.key, label: req.file.originalname});
        } else {
          callback(null, {});
        }
      }
    });
  },

  removeFile: function (req, res, key, callback) {
    var params = { Bucket: process.env.AWS_BUCKET_NAME, Key: key };
    s3.deleteObject(params, function (err, data) {
      if (err) {
        callback({error: err});
      } else {
        callback(null, {status: "success"});
      }
    });
  }
};