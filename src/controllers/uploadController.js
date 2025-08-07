import logger from "../config/loggerConfig.js"

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