import { defaultMimeTypes } from "../constants/mimeTypes.js";
import 'dotenv/config'; 

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
const isValidEnvKey = (key) => key && key.trim() !== '';

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
const getValueFromEnv = (key) => process.env[key] || '';

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
    .split(',')     // Tách chuỗi thành mảng dựa vào dấu phẩy
    .map(el => el.trim()) // Xóa khoảng trắng thừa
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
export const allowMimeType = {
  image: getMimeTypesFromEnv('ALLOWED_MIME_TYPES_IMAGE') || defaultMimeTypes.image,
  video: getMimeTypesFromEnv('ALLOWED_MIME_TYPES_VIDEO') || defaultMimeTypes.video,
  audio: getMimeTypesFromEnv('ALLOWED_MIME_TYPES_AUDIO') || defaultMimeTypes.audio,
  document: getMimeTypesFromEnv('ALLOWED_MIME_TYPES_DOCUMENT') || defaultMimeTypes.document,
};

// Debug: in object dưới dạng JSON format đẹp
console.log(JSON.stringify(allowMimeType, null, 2));
