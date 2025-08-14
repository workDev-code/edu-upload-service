// logger.js
import path from "path";
import winston from "winston";
import moment from "moment-timezone";
import util from "util"; // <-- thêm dòng này
const logger = createLogger(import.meta.url); // tạo instance logger

export function createLogger(moduleFilename) {
  const filename = path.basename(moduleFilename);
  const isProd = process.env.NODE_ENV === "production";

  return winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: winston.format.combine(
      // cho phép %s / %o nếu muốn later
      winston.format.splat(),
      // colorize chỉ ảnh hưởng console formatter, safe to include
      !isProd ? winston.format.colorize() : winston.format.uncolorize(),
      winston.format.label({ label: filename }),
      winston.format.printf(({ level, message, label, ...meta }) => {
        const timestamp = moment()
          .tz("Asia/Ho_Chi_Minh")
          .format("YYYY-MM-DD HH:mm:ss");
        // nếu meta rỗng thì không in, nếu có thì pretty inspect
        const metaKeys = Object.keys(meta);
        const metaInfo =
          metaKeys.length > 0
            ? `\n${util.inspect(meta, {
                depth: null,
                colors: !isProd,
                compact: false,
              })}`
            : "";
        return `[${timestamp}] [${label}] ${level}: ${message}${metaInfo}`;
      })
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({
        filename: "logs/error.log",
        level: "error",
      }),
      new winston.transports.File({ filename: "logs/combined.log" }),
    ],
  });
}
export default createLogger;

export const logUnexpectedFileLimit = (req) => {
  logger.warn("Vượt quá số lượng file cho phép.", {
    ip: req.ip,
    url: req.originalUrl,
    method: req.method,
    filesReceived: req.files?.length || 0,
  });
};

export const logMulterError = (err, req) => {
  logger.warn("Lỗi multer khác.", {
    error: err.message,
    code: err.code,
    ip: req.ip,
    url: req.originalUrl,
  });
};

export const logUnknownUploadError = (err, req) => {
  logger.error("Lỗi không xác định khi upload file.", {
    error: err.message,
    ip: req.ip,
    url: req.originalUrl,
  });
};

export const logUploadSuccess = (req) => {
  // Nếu có req.files (array) → dùng trực tiếp
  // Nếu có req.file (single) → tạo mảng 1 phần tử
  const files = req.files || (req.file ? [req.file] : []);

  logger.info(`Upload thành công ${files.length} file.`, {
    ip: req.ip,
    url: req.originalUrl,
    method: req.method,
    filenames: files.map((f) => f.originalname),
  });
};
