import "express-async-errors";
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import { StatusCodes } from "http-status-codes";
import morgan from "morgan";
import cookieParser from "cookie-parser";

// Middlewares ------
import errorHandlerMiddleware from "./server/middleware/errorHandlerMiddleware.js";
import { protectAdminRoute } from "./server/middleware/authMiddleware.js";

// Routes ------
import authRoutes from "./server/routes/authRoutes.js";
import adminRoutes from "./server/routes/adminRoutes.js";
import csvRoutes from "./server/routes/csvRoutes.js";
import coUsersRoute from "./server/routes/coUsersRoute.js";

// public ------
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.resolve(__dirname, "./server/public")));

if (process.env.APP_ENV === "development") {
  app.use(morgan("dev"));
}

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cookieParser());
app.use(express.json());

// API starts ---
app.use("/api/auth", authRoutes);
app.use("/api/admin", protectAdminRoute, adminRoutes);
app.use("/api/company", [csvRoutes, coUsersRoute]);
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
