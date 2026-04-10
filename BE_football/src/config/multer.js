const fs = require("fs");
const multer = require("multer");
const path = require("path");

const uploadDir = path.join(__dirname, "..", "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// cấu hình storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

// filter file (chỉ cho upload ảnh)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpg|jpeg|png|gif/;
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ được upload file ảnh!"), false);
  }
};

// tạo instance multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // max 5MB
});

module.exports = upload;