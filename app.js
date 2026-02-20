
require('dotenv').config();
const express = require('express');
const userModule = require('./modules/user');
const productRoute = require('./modules/product');
const categoryRoute = require('./modules/category');
const trademarkRoute = require('./modules/trademark');
const cloudinary = require('./config/cloudinary');
const connectDB = require('./config/Db');


const app = express();
app.use(express.json());
connectDB();
const cors = require('cors');


const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
];

if (process.env.URL_FE) {
    allowedOrigins.push(process.env.URL_FE);
}

// CORS chính
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

app.use('/api/users', userModule);
app.use('/api/product', productRoute);
app.use('/api/category', categoryRoute);
app.use('/api/trademark', trademarkRoute);



app.get('/', (req, res) => {
    res.json({
        status: true,
        message: 'Welcome to the project Backend Z Mobile 🚀'
    });
});

module.exports = app;