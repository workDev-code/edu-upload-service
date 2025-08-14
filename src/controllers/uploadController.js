import fs from "fs/promises";
import path from "path";
import "dotenv/config";
import { isFileExists, deleteFileSafely } from "../utils/fileUtils.js";
import createLogger from "../config/loggerConfig.js";

const UPLOAD_DIR = process.env.UPLOAD_DIR;

// Lấy logger kèm tên file controller
const logger = createLogger(import.meta.url || __filename);

export const handleUpload = async (req, res) => {
  try {
    if (!req.file) {
      logger.warn("Upload thất bại: không có file nào được gửi lên");
      return res.status(400).json({ error: "Không có file nào được gửi lên." });
    }

    logger.info(
      `Upload thành công file: ${req.file.originalname} -> ${req.file.filename}`
    );

    res.status(200).json({
      message: "Tải lên thành công!",
      file: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        url: `/uploads/${req.file.filename}`,
      },
    });
  } catch (error) {
    logger.error(`Lỗi trong quá trình upload: ${error.stack}`);
    res.status(500).json({
      error: "Đã xảy ra lỗi trong quá trình upload. Vui lòng thử lại sau.",
    });
  }
};

export const handleUploadMultileFiles = (fileType) => async (req, res) => {
  logger.info(fileType);
  try {
    
    if (!req.files || req.files.length === 0) {
      logger.warn("Upload nhiều file thất bại: không có file nào được gửi lên");
      return res.status(400).json({ error: "Không có file nào được gửi lên." });
    }

    const uploadedFiles = req.files.map((file) => ({
      originalName: file.originalname,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      url: `/uploads/${fileType}s/${file.filename}`,
    }));

    logger.info(
      `Upload nhiều file thành công: ${uploadedFiles
        .map((f) => f.filename)
        .join(", ")}`
    );

    res.json({
      message: "Upload nhiều file thành công!",
      files: uploadedFiles,
    });
  } catch (error) {
    logger.error(`Lỗi trong quá trình upload nhiều file: ${error.stack}`);
    res.status(500).json({
      error: "Đã xảy ra lỗi trong quá trình upload. Vui lòng thử lại sau.",
    });
  }
};

export const listUploadedFiles  = async (_, res) => {
  try {
    const uploadDir = path.join(process.cwd(), "src", "uploads");

    try {
      await fs.access(uploadDir);
    } catch {
      logger.warn("Truy cập thư mục uploads thất bại: không tồn tại");
      return res.status(404).json({ error: "Thư mục uploads không tồn tại." });
    }

    const files = await fs.readdir(uploadDir);
    logger.info(`Liệt kê ${files.length} file trong thư mục uploads`);

    res.status(200).json({
      total_files: files.length,
      files: files,
    });
  } catch (error) {
    logger.error(`Lỗi khi đọc danh sách file upload: ${error.stack}`);
    res.status(500).json({ error: "Không thể đọc danh sách file upload." });
  }
};

export const deleteUpload = async (req, res) => {
  try {
    const { filename } = req.query;

    if (!filename || filename.includes("..") || filename.includes("/")) {
      logger.warn(`Tên file không hợp lệ: ${filename}`);
      return res.status(400).json({
        success: false,
        error: "Invalid filename.",
      });
    }

    const uploadsPath = path.join(process.cwd(), "src", UPLOAD_DIR);
    const filePath = path.join(uploadsPath, filename);

    if (!isFileExists(filePath)) {
      logger.warn(`File không tồn tại: ${filename}`);
      return res.json({
        success: false,
        message: `❌ File không tồn tại: ${filename}`,
      });
    }

    deleteFileSafely(filePath);
    logger.info(`Đã xóa file: ${filename}`);

    return res.json({
      success: true,
      message: `✅ Đã xóa file: ${filename}`,
    });
  } catch (error) {
    logger.error(`Lỗi khi xóa file ${req.query.filename}: ${error.stack}`);
    res.status(500).json({ message: "Không thể xóa file." });
  }
};
