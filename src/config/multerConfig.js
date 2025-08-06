// Import các thư viện cần thiết
import multer from 'multer';                   // Multer: middleware để xử lý upload file trong Express
import path from 'path';                       // path: làm việc với đường dẫn file (join, resolve, v.v.)
import fs from 'fs';                           // fs: thao tác với file và thư mục (đọc, ghi, tạo thư mục)
import { fileURLToPath } from 'url';           // Chuyển đổi URL module thành đường dẫn thực tế (dùng trong ES Module)
import 'dotenv/config'; 

// 👉 Đây là một file cấu hình và khởi tạo middleware
//  multer để giúp backend xử lý việc upload file từ người dùng

// Tạo biến __filename và __dirname thủ công (vì ES Module không hỗ trợ sẵn)
const __filename = fileURLToPath(import.meta.url);  // Lấy đường dẫn file hiện tại
const __dirname = path.dirname(__filename);         // Lấy thư mục cha chứa file hiện tại


const uploadDir = process.env.UPLOAD_DIR || 'uploads'

// Tạo đường dẫn tuyệt đối tới thư mục uploads nằm cùng cấp thư mục gốc backend
const uploadPath = path.join(__dirname, '..', uploadDir);

// Kiểm tra nếu thư mục uploads chưa tồn tại thì tạo mới nó
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true }); // recursive: đảm bảo tạo cả thư mục cha nếu cần
}

// Cấu hình nơi lưu và cách đặt tên file với Multer
const storage = multer.diskStorage({
  // Hàm xác định thư mục lưu file
  destination: (req, file, cb) => {
    cb(null, uploadPath);  // Truyền đường dẫn thư mục upload cho Multer
  },

  // Hàm đặt tên file khi lưu
  filename: (req, file, cb) => {
    const timestamp = Date.now();                 // Lấy thời gian hiện tại (tính bằng ms)
    const originalName = file.originalname;       // Tên file gốc do người dùng upload
    cb(null, `${timestamp}-${originalName}`);     // Đặt tên mới: thời_gian-gốc.ext → tránh trùng tên
  }
});

// Tạo middleware Multer với cấu hình đã định nghĩa
const upload = multer({ storage });

// Export middleware này để dùng trong các route khác
export default upload;
