import "express-async-errors";
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import { StatusCodes } from "http-status-codes";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";

// Middlewares ------
import errorHandlerMiddleware from "./server/middleware/errorHandlerMiddleware.js";
import { protectSuperAdminRoute } from "./server/middleware/authMiddleware.js";

// Routes ------
import authRoutes from "./server/routes/authRoutes.js";
import adminRoutes from "./server/routes/adminRoutes.js";
import coUsersRoutes from "./server/routes/coUsersRoutes.js";
import coLeadsRoutes from "./server/routes/coLeadsRoutes.js";
import coLeadActionRoutes from "./server/routes/coLeadActionRoutes.js";
import profileRoutes from "./server/routes/profileRoutes.js";

// Cloudinary setup ------
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// public ------
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.resolve(__dirname, "./server/public")));

if (process.env.APP_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cookieParser());
app.use(express.json());

// API starts ---
app.use("/api/auth", authRoutes);
app.use("/api/admin", protectSuperAdminRoute, adminRoutes);
app.use("/api/company", [coUsersRoutes, coLeadsRoutes]);
app.use("/api/lead", coLeadActionRoutes);
app.use("/api/profile", profileRoutes);
// API ends ---

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./frontend", "index.html"));
});

const port = process.env.APP_PORT || 3001;

app.use("*", (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({ msg: `not found` });
});

app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
