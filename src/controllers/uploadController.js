import logger from "../config/loggerConfig.js"
import fs from 'fs/promises';
import path from 'path';
import 'dotenv/config'; 
import {
  isFileExists,
  deleteFileSafely
} from "../utils/fileUtils.js"



const UPLOAD_DIR = process.env.UPLOAD_DIR;

export const handleUpload = async (req, res) => {
  // Xử lý upload
   try {
    if (!req.file) {
      return res.status(400).json({ error: 'Không có file nào được gửi lên.' });
    }
    console.log('✅ File nhận được:', req.file);

    res.status(200).json({
      message: 'Tải lên thành công!',
      file: req.file
    });
  } catch (error) {
    console.error('❌ Lỗi trong quá trình upload:', error);
    res.status(500).json({
      error: 'Đã xảy ra lỗi trong quá trình upload. Vui lòng thử lại sau.'
    });
  }
};

export const handleUploadMultileFiles = async (req, res) => {
  try{
    // check coi có files nào được gửi lên không
    if(!req.files || req.files.length === 0){
        logger.warn('Upload thất bại: không có file nào được gửi lên'); // ⚠️ ghi log warning
        return res.status(400).json({ error: 'Không có file nào được gửi lên.' });
    }

    const uploadedFiles = req.files.map(file => ({
      originalName: file.originalname, 	// Tên thật file người dùng gửi lên
      filename: file.filename, // Tên file do server đặt (tránh trùng, an toàn)
      mimetype: file.mimetype,
      size: file.size,
      url: `${process.env.HOST_URL}/uploads/${file.filename}` // 🔗 Trả về link truy cập công khai
    }));

    res.json({
      message: 'Upload nhiều file thành công!',
      files: uploadedFiles
    });

  }catch(error){
    console.error('❌ Lỗi trong quá trình upload:', error);
    res.status(500).json({
      error: 'Đã xảy ra lỗi trong quá trình upload. Vui lòng thử lại sau.'
    });
  }
}


export const listUploadedFiles = async (_, res) => {
  try{
    const uploadDir = path.join(process.cwd(), 'src', 'uploads'); // điều chỉnh nếu uploads ở chỗ khác

    // Kiểm tra xem thư mục có tồn tại không
    try {
      await fs.access(uploadDir); // ném lỗi nếu không tồn tại hoặc không truy cập được
    } catch (accessErr) {
      return res.status(404).json({ error: 'Thư mục uploads không tồn tại.' });
    }

    const files = await fs.readdir(uploadDir);
    res.status(200).json({
      total_files: files.length,
      files: files,
    });
  }catch(error){
    console.error('❌ Lỗi trong quá trình upload:', error);
    res.status(500).json({ error: 'Không thể đọc danh sách file upload.' });
  }
}

export const deleteUpload = async (req, res) => {
  try{
    const { filename } = req.params;
    console.log(filename);
    // 1. Validate tên file: không chứa "..", "/", "\", v.v.
    if (!filename || filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid filename.',
      });
    }

    // 2. Join đường dẫn an toàn: path.join(uploadsDir, filename)

    // Lấy path gốc dự án
    const rootProjectPath = process.cwd();

    // Path tuyệt đối tới thư mục uploads
    const uploadsPath = path.join(rootProjectPath, 'src', UPLOAD_DIR);

    // Path tuyệt đối tới file
    const filePath = path.join(uploadsPath, filename)

    // 3. Check tồn tại
    if (!isFileExists(filePath)) {
    return res.json({
        success: false,
        message: `❌ File không tồn tại: ${path.basename(filePath)}`
      });
    }

    // 4. Xóa file
    deleteFileSafely(filePath);
    // 5. Trả về response thành công
    return res.json({
      success: true,
      message: `✅ Đã xóa file: ${path.basename(filePath)}`
    });

  }catch(error){
    // Ghi log lỗi, trả lỗi 500
    logger.error(`Lỗi khi xóa file ${filePath}: ${error.stack}`);
    res.status(500).json({ message: 'Không thể xóa file.' });
  }
}