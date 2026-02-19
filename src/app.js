const express = require('express');
const userModule = require('./modules/user');
const productRoute = require('./modules/product'); // Đổi tên cho rõ nghĩa
const connectDB = require('../src/config/Db');
const app = express();
app.use(express.json());
connectDB();


app.use('/api/users', userModule);
app.use('/api/product', productRoute);



app.get('/', (req, res) => {
    res.json({
        status: true,
        message: 'Welcome to the project Backend Z Mobile 🚀'
    });
});

module.exports = app;