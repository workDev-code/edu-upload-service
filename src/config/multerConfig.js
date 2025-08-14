// Import các thư viện cần thiết
import multer from "multer"; // Multer: middleware để xử lý upload file trong Express
import path from "path"; // path: làm việc với đường dẫn file (join, resolve, v.v.)
import fs from "fs"; // fs: thao tác với file và thư mục (đọc, ghi, tạo thư mục)
import { fileURLToPath } from "url"; // Chuyển đổi URL module thành đường dẫn thực tế (dùng trong ES Module)
import "dotenv/config";
import { allowMimeTypes } from "./mimeTypesConfig.js";
import { mimeTypesFilter } from "../middlewares/mimeTypesFilter.js";
import { createLogger } from "../config/loggerConfig.js";
import { typeConfigs } from "./mimeTypesConfig.js";

const logger = createLogger(import.meta.url || __filename);

// 👉 Đây là một file cấu hình và khởi tạo middleware
//  multer để giúp backend xử lý việc upload file từ người dùng

// Tạo biến __filename và __dirname thủ công (vì ES Module không hỗ trợ sẵn)
const __filename = fileURLToPath(import.meta.url); // Lấy đường dẫn file hiện tại
const __dirname = path.dirname(__filename); // Lấy thư mục cha chứa file hiện tại

// console.log(allowedTypes);
const baseUploadDir = process.env.UPLOAD_DIR || "uploads";

// nếu client truyền lên kí tự nguy hiểm
export const createMulterUploaderForType = (type) => {
  // falsy
  if (!type) {
    logger.error("Uploader creation failed: 'type' is required.");
    throw new Error("Missing required parameter: type");
  }

  const cfg = typeConfigs[type];
  if (!cfg) {
    logger.error(`Invalid upload type: ${type}`);
    throw new Error(`Invalid upload type: ${type}`);
  }

  // Tạo đường dẫn tuyệt đối tới thư mục uploads nằm cùng cấp thư mục gốc backend
  const safeType = type.replace(/[^\w-]+/g, "_");
  const uploadPath = path.join(__dirname, "..", "..", baseUploadDir, safeType);

  // Kiểm tra nếu thư mục uploads chưa tồn tại thì tạo mới nó
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true }); // recursive: đảm bảo tạo cả thư mục cha nếu cần
  }

  logger.info(`Upload directory for '${safeType}': ${uploadPath}`);

  // Cấu hình nơi lưu và cách đặt tên file với Multer
  const storage = multer.diskStorage({
    // Hàm xác định thư mục lưu file
    destination: (req, file, cb) => {
      cb(null, uploadPath); // Truyền đường dẫn thư mục upload cho Multer
    },
    // Hàm đặt tên file khi lưu
    filename: (_, file, cb) => {
      const safeName = file.originalname.replace(/[^\w.-]+/g, "_");
      cb(null, `${Date.now()}-${safeName}`);
    },
  });

  return multer({
    storage,
    // fileFilter: mimeTypesFilter(),
  });
};
