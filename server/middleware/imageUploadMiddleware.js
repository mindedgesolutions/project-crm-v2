import multer from "multer";
import { BadRequestError } from "../errors/customErrors.js";
import path from "path";

// ------
const checkFileType = (file, cb) => {
  const filetypes = /jpeg|jpg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

// Group image upload starts ------
const uploadGroupImage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "server/public/group");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

export const groupImage = multer({
  storage: uploadGroupImage,
  limits: { fileSize: 50 * 1000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});
// Group image upload ends ------
