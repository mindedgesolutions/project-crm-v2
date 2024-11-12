import multer from "multer";
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

// ------
const checkFileTypeCsv = (file, cb) => {
  const allowedMimeTypes = ["text/csv", "application/vnd.ms-excel"];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type! Only CSV files are allowed!"), false);
  }
};

// Group image upload starts ------
const uploadGroupImage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "server/public/group");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname);
  },
});

export const groupImage = multer({
  storage: uploadGroupImage,
  limits: { fileSize: 50 * 1024 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});
// Group image upload ends ------

// Network image upload starts ------
const uploadNetworkImage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "server/public/network");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname);
  },
});

export const networkImage = multer({
  storage: uploadNetworkImage,
  limits: { fileSize: 50 * 1024 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});
// Network image upload ends ------

// CSV upload starts ------
const uploadLeadCsv = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "server/public/csv");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + file.originalname);
  },
});

export const leadCsv = multer({
  storage: uploadLeadCsv,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    checkFileTypeCsv(file, cb);
  },
});
// CSV upload ends ------
