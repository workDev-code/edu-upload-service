import { defaultMimeTypes } from "../constants/mimeTypes.js";
import "dotenv/config";
import { createLogger } from "./loggerConfig.js";

const logger = createLogger(import.meta.url || __filename);
/**
 * Kiểm tra xem key biến môi trường có hợp lệ không.
 * Hợp lệ nghĩa là: không null, không undefined và không phải chuỗi rỗng.
 *
 * @param {string} key - Tên biến môi trường cần kiểm tra.
 * @returns {boolean} - `true` nếu key hợp lệ, `false` nếu không.
 *
 * @example
 * # Hợp lệ
 * isValidEnvKey('ALLOWED_MIME_TYPES_IMAGE'); // true
 * # Không hợp lệ
 * isValidEnvKey(''); // false
 */
const isValidEnvKey = (key) => key && key.trim() !== "";

/**
 * Lấy giá trị của một biến môi trường từ process.env.
 * Nếu biến không tồn tại → trả về chuỗi rỗng.
 *
 * @param {string} key - Tên biến môi trường.
 * @returns {string} - Giá trị của biến hoặc '' nếu không tồn tại.
 *
 * @example
 * # Nếu process.env.NODE_ENV = "development"
 * getValueFromEnv('NODE_ENV'); // "development"
 * # Nếu biến không tồn tại
 * getValueFromEnv('NOT_EXIST'); // ""
 */
const getValueFromEnv = (key) => process.env[key] || "";

/**
 * Chuyển chuỗi MIME types thành mảng đã loại bỏ khoảng trắng và phần tử rỗng.
 *
 * @param {string} valueStr - Chuỗi MIME types, ví dụ: "image/jpeg, image/png".
 * @returns {string[]} - Mảng MIME types sạch.
 *
 * @example
 * parseMimeTypes("image/jpeg, image/png, , image/webp");
 * # => ["image/jpeg", "image/png", "image/webp"]
 */
const parseMimeTypes = (valueStr) => {
  return valueStr
    .split(",") // Tách chuỗi thành mảng dựa vào dấu phẩy
    .map((el) => el.trim()) // Xóa khoảng trắng thừa
    .filter(Boolean); // Loại bỏ phần tử rỗng
};

/**
 * Lấy danh sách MIME types từ biến môi trường dựa vào tên key.
 * Nếu không tồn tại hoặc giá trị rỗng → trả về mảng rỗng.
 *
 * @param {string} envKey - Tên biến môi trường chứa danh sách MIME types.
 * @returns {string[]} - Mảng MIME types hợp lệ.
 *
 * @example
 * # Nếu ALLOWED_MIME_TYPES_IMAGE="image/jpeg,image/png"
 * getMimeTypesFromEnv('ALLOWED_MIME_TYPES_IMAGE');
 * # => ["image/jpeg", "image/png"]
 */
const getMimeTypesFromEnv = (envKey) => {
  if (!isValidEnvKey(envKey)) return [];

  const mimeTypesString = getValueFromEnv(envKey);
  if (!mimeTypesString.trim()) return [];

  return parseMimeTypes(mimeTypesString);
};

/**
 * Đối tượng chứa các nhóm MIME types được phép.
 *
 * Input:
 * - Lấy từ biến môi trường:
 *   - ALLOWED_MIME_TYPES_IMAGE
 *   - ALLOWED_MIME_TYPES_VIDEO
 *   - ALLOWED_MIME_TYPES_AUDIO
 *   - ALLOWED_MIME_TYPES_DOCUMENT
 * - Nếu biến môi trường không tồn tại → fallback sang defaultMimeTypes.
 *
 * Output:
 * {
 *   image: string[],
 *   video: string[],
 *   audio: string[],
 *   document: string[]
 * }
 *
 * @example
 * # Nếu .env không khai báo ALLOWED_MIME_TYPES_IMAGE
 * console.log(allowMimeType.image);
 * # => defaultMimeTypes.image
 */
export const allowMimeTypes = {
  image:
    getMimeTypesFromEnv("ALLOWED_MIME_TYPES_IMAGE") || defaultMimeTypes.image,
  video:
    getMimeTypesFromEnv("ALLOWED_MIME_TYPES_VIDEO") || defaultMimeTypes.video,
  audio:
    getMimeTypesFromEnv("ALLOWED_MIME_TYPES_AUDIO") || defaultMimeTypes.audio,
  document:
    getMimeTypesFromEnv("ALLOWED_MIME_TYPES_DOCUMENT") ||
    defaultMimeTypes.document,
};

// Debug: in object dưới dạng JSON format đẹp
console.log(JSON.stringify(allowMimeTypes, null, 2));

export const typeConfigs = {
  images: {
    maxFiles: 10, // Số lượng file tối đa được upload trong 1 lần cho loại ảnh
    maxFileSize: 5 * 1024 * 1024, // Kích thước file tối đa (5 MB) cho mỗi file ảnh
    allowedMime: allowMimeTypes.image, // Danh sách các định dạng MIME hợp lệ cho ảnh (vd: jpeg, png, webp, gif)
    quotaPerMonth: 500 * 1024 * 1024, // Hạn mức dung lượng tối đa được upload trong 1 tháng (500 MB) cho ảnh
  },
  videos: {
    maxFiles: 5, // Số lượng file tối đa trong 1 lần upload cho video
    maxFileSize: 100 * 1024 * 1024, // Kích thước file tối đa (100 MB) cho mỗi video
    allowedMime: allowMimeTypes.video, // Các định dạng MIME video được phép (mp4, mkv, quicktime, ...)
    quotaPerMonth: 5 * 1024 * 1024 * 1024, // Hạn mức dung lượng tối đa upload video mỗi tháng (5 GB)
  },
  documents: {
    maxFiles: 20, // Số lượng file tối đa trong 1 lần upload cho tài liệu
    maxFileSize: 10 * 1024 * 1024, // Kích thước tối đa mỗi file tài liệu là 10 MB
    allowedMime: allowMimeTypes.document, // Các định dạng MIME tài liệu hợp lệ (pdf, word, txt,...)
    quotaPerMonth: 1024 * 1024 * 1024, // Hạn mức dung lượng upload tài liệu tối đa 1 GB/tháng
  },
  audios: {
    maxFiles: 10, // Số lượng file audio tối đa trong 1 lần upload
    maxFileSize: 50 * 1024 * 1024, // Kích thước tối đa mỗi file audio là 50 MB
    allowedMime: allowMimeTypes.audio, // Các định dạng MIME audio hợp lệ (mp3, wav, ogg,...)
    quotaPerMonth: 1024 * 1024 * 1024, // Hạn mức dung lượng upload audio tối đa 1 GB/tháng
  },
  // Ví dụ cho trường hợp mix các file khác (để mở rộng)
  // mixes: {
  //   maxFiles: 10,                           // Số lượng file tối đa cho các loại file hỗn hợp
  //   maxFileSize: 30 * 1024 * 1024,          // Kích thước tối đa mỗi file là 30 MB
  //   allowedMime: allowMimeTypes.,            // Định dạng MIME tùy ý (null hoặc array)
  //   quotaPerMonth: 1024 * 1024 * 1024,       // Hạn mức dung lượng tối đa 1 GB/tháng
  // },
};

// logger.info("typeConfigs object: ", typeConfigs);
