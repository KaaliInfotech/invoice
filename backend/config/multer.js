const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/logo'); // Specify the folder where the files should be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Specify the filename
  }
});

const upload = multer({ storage: storage }).fields([
  { name: 'logo', maxCount: 1 },
  { name: 'signlogo', maxCount: 1 }
]);

module.exports.upload = upload;
