// app.js
import express from "express";
import cors from "cors";
import path, { dirname, resolve, join } from "path";
import { fileURLToPath } from "url";

import uploadRouter from "./routes/uploadRoute.js";
import { createLogger } from "./config/loggerConfig.js";

// Tạo logger (truyền vào đường dẫn file hiện tại)
const logger = createLogger(import.meta.url);

// Lấy __dirname theo ES Modules
const __dirname = dirname(fileURLToPath(import.meta.url));

// Khởi tạo app
const app = express();

// Middleware cơ bản
app.use(cors());
app.use(express.json());

// Static folders
const uploadsDir = resolve(__dirname, "../uploads");
app.use(express.static(join(__dirname, "public")));
app.use("/uploads", express.static(uploadsDir));

// Log thư mục uploads
logger.info(`📂 Static uploads folder mapped to: ${uploadsDir}`);

// Routes
app.get("/", (_, res) =>
  res.json({ message: "Chào bạn! Đây là JSON response từ Express." })
);

app.use("/uploads", uploadRouter);

export default app;
