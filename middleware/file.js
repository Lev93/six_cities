const multer = require('multer');
const uniqid = require('uniqid');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'public/img/avatars');
  },
  filename(req, file, cb) {
    cb(null, uniqid() + file.originalname);
  },
});

const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

module.exports = multer({
  storage, fileFilter,
});
