// tạo middleware filter
import { allowMimeTypes } from "../config/mimeTypesConfig.js";
import logger from "../config/loggerConfig.js";

/**
 * Middleware filter cho Multer để kiểm tra loại file (mime type) trước khi lưu.
 * - Được gọi tự động bởi Multer khi người dùng upload file.
 * - Nhiệm vụ chính:
 *    1. Ghi log thông tin file được upload (tên, loại, kích thước, v.v.) bằng logger.
 *    2. Kiểm tra `file.mimetype` để xác định có cho phép lưu file hay không.
 *       - Nếu là file nằm trong allowMimeTypes, sẽ từ chối upload bằng cách gọi `cb(null, false)`.
 *       - Ngược lại, cho phép lưu bằng `cb(null, true)`.
 * - Tham số callback `cb`:
 *    - cb(error, allow):
 *        + error: `Error` nếu muốn báo lỗi upload, hoặc `null` nếu không có lỗi.
 *        + allow: `true` → cho phép lưu, `false` → từ chối lưu.
 *
 * @returns {(req, file, cb) => void} Hàm filter được dùng trong Multer config (option `fileFilter`)
 */
export const mimeTypesFilter = () => {
  return (req, file, cb) => {
    // Bỏ qua file nếu là hình ảnh
    if (file.mimetype.startsWith("image/")) {
      return cb(null, true);
    }
    // Bỏ qua file nếu là video
    if (file.mimetype.startsWith("video/")) {
      return cb(null, false);
    }
    cb(null, false);
  };
};
