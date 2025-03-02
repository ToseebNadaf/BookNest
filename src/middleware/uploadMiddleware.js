const multer = require("multer");
const cloudinary = require("../utils/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "book-covers",
    format: async (req, file) => "png",
    public_id: (req, file) => `book-cover-${Date.now()}`,
  },
});

const upload = multer({ storage });

module.exports = { upload };
