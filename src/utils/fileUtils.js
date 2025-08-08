// utils/fileUtils.js
import fs from 'fs';
import logger from '../config/loggerConfig.js';

/**
 * Kiểm tra file có tồn tại không (theo path tuyệt đối)
 * @param {string} filePath - Đường dẫn tuyệt đối tới file
 * @returns {boolean} true nếu tồn tại, false nếu không
 */


export function isFileExists(filePath) {
    try {
        return fs.existsSync(filePath);
    } catch (error) {
        logger.error(`Lỗi khi kiểm tra file: ${filePath} - ${error.message}`);
        return false;
    }
}

/**
 * Xóa file an toàn
 * @param {string} absolutePath - Đường dẫn tuyệt đối tới file
 * @param {string} relativePathForLog - Đường dẫn tương đối để log (ẩn cấu trúc server)
 */
export function deleteFileSafely(absolutePath, relativePathForLog = '') {
    try {
        if (fs.existsSync(absolutePath)) {
            fs.unlinkSync(absolutePath);
            logger.info(`Đã xóa file: ${relativePathForLog || absolutePath}`);
        } else {
            logger.warn(`File không tồn tại: ${relativePathForLog || absolutePath}`);
        }
    } catch (error) {
        logger.error(`Lỗi khi xóa file ${relativePathForLog || absolutePath}: ${error.message}`);
    }
}
