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

    // logger.info(`Upload thành công ${req.files.length} file`);
    res.status(200).json({ message: 'Upload thành công'});

  }catch(error){
    console.error('❌ Lỗi trong quá trình upload:', error);
    res.status(500).json({
      error: 'Đã xảy ra lỗi trong quá trình upload. Vui lòng thử lại sau.'
    });
  }
}