const express = require('express');
const userModule = require('./modules/user');
const app = express();
app.use(express.json());



app.use('/api/users', userModule);
app.get('/', (req, res) => {
    res.json({
        status: true,
        message: 'Server is running! 🚀'
    });
});

module.exports = app;
