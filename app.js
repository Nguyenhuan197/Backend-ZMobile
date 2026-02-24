require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

// 1. Require các cấu hình & Route
const connectDB = require('./config/Db');
const userModule = require('./modules/user');
const productRoute = require('./modules/product');
const categoryRoute = require('./modules/category');
const trademarkRoute = require('./modules/trademark');
const order = require('./modules/order');
const newsRouter = require('./modules/news');
const infomationAdminRouter = require('./modules/infomationAdmin');


// 2. Khởi tạo App
const app = express();

// 3. Kết nối Database
connectDB();

// 4. Cấu hình Middlewares
app.use(express.json());

// --- QUAN TRỌNG: Cấu hình Static Files để đọc ảnh ---
// Khi dùng dòng này, file trong thư mục /public sẽ truy cập trực tiếp qua tên file
app.use(express.static(path.join(__dirname, 'public')));

// 5. Cấu hình CORS
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
];
if (process.env.URL_FE) {
    allowedOrigins.push(process.env.URL_FE);
}

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));


// 6. Định nghĩa Routes
app.use('/api/users', userModule);
app.use('/api/product', productRoute);
app.use('/api/category', categoryRoute);
app.use('/api/trademark', trademarkRoute);
app.use('/api/order', order);
app.use('/api/news', newsRouter);
app.use('/api/infomation-Admin', infomationAdminRouter);



app.get('/', (req, res) => {
    res.json({
        status: true,
        message: 'Welcome to the project Backend Z Mobile 🚀'
    });
});

module.exports = app;