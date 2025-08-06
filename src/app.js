import express from 'express';
import cors from 'cors';
import uploadRouter from './routes/uploadRoute.js';


const app = express();
app.use(cors());
app.use(express.json());

// Tạo route GET "/"
app.get('/', (req, res) => {
  res.json({ message: "Chào bạn! Đây là JSON response từ Express." });
});

// => Nghĩa là: mọi route bên trong uploadRouter sẽ có tiền tố là /upload
app.use('/upload', uploadRouter);

export default app;