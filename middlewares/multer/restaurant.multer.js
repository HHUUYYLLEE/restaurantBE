const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../public/uploads/restaurants");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.fieldname + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });
module.exports = upload;
