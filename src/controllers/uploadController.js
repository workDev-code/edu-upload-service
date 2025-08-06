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
