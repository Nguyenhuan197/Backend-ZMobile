const express = require("express");
const router = express.Router();
const connectSchema = require("../Schema/user");
const encryptionPaswoord = require('../modules/middlewares/Password');
const conectEncryptionPaswoord = new encryptionPaswoord();
const mongoose = require('mongoose');
const connectToken = require('jsonwebtoken');
const secretKey = process.env.SECRETKEY; // Chữ ký
const expirationDateTocken = process.env.EXPIRESIN;


const addNew = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!name?.trim() || !email?.trim() || !password?.trim()) return res.status(200).json({ message_vn: 'Vui lòng nhập đủ thông tin', message_en: 'Please enter all the required information', status: false });
        const passwordEncryption = await conectEncryptionPaswoord.hashPassword(password);
        const newProduct = new connectSchema({ name, email, password: passwordEncryption });
        const result = await newProduct.save();
        if (!result) return res.status(400).json({ mesage_vn: 'Thêm tài khoản thất bại', mesage_en: 'More user failures', status: false });

        const dataToken = { _id: result._id }
        const token = connectToken.sign(dataToken, secretKey, { expiresIn: expirationDateTocken });
        return res.status(201).json({ message_vn: 'Thêm tài khoản thành công', message_en: 'More user success', status: true, token });
    } catch (error) {
        if (error) return next(error);
    }
};


login = async (req, res, next) => {
    const bcrypt = require('bcrypt');
    const { email, password } = req.body;
    if (!email?.trim() || !password?.trim()) return res.status(200).json({ message_vn: 'Vui lòng nhập đủ thông tin', message_en: 'Please enter all the required information', status: false });

    try {
        const resultPassword = await connectSchema
            .findOne({ email })
            .select('password');

        if (!resultPassword) return res.status(201).json({ message_vn: 'Đăng nhập thất bại', message_en: 'Login failed', status: false });
        const isMatch = await bcrypt.compare(password, resultPassword.password);
        if (!isMatch) return res.status(201).json({ message_vn: 'Đăng nhập thất bại', message_en: 'Login failed', status: false });
        const dataToken = { _id: resultPassword._id }
        const token = connectToken.sign(dataToken, secretKey, { expiresIn: expirationDateTocken });;
        res.status(201).json({ message_vn: 'Đăng nhập thành công', message_en: 'Login successful', token, status: true });
    } catch (error) {
        if (error) return next(error);
    }
}

const viewAll = async (req, res, next) => {
    try {
        const result = await connectSchema
            .find({})
            .select('name image email status');
        if (result.length === 0) return res.status(400).json({ mesage_vn: 'Không có dữ liệu', mesage_en: 'No data found', data: [], status: false });
        return res.status(200).json({ mesage_vn: 'Truy vấn thành công', mesage_en: 'Query successful', data: result, status: true });
    } catch (error) {
        if (error) return next(error);
    }
}

const viewOne = async (req, res, next) => {
    const _id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).json({ mesage_vn: 'Lỗi truy vấn', mesage_en: 'Erro query', Status: false });

    try {
        const result = await connectSchema
            .findOne({ _id })
            .select('name image email status');
        if (result.length === 0) return res.status(400).json({ mesage_vn: 'Không có dữ liệu', mesage_en: 'No data found', data: [], status: false });
        return res.status(200).json({ mesage_vn: 'Truy vấn thành công', mesage_en: 'Query successful', data: result, status: true });
    } catch (error) {
        if (error) return next(error);
    }
}

const stateTransition = async (req, res, next) => {
    const _id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).json({ mesage_vn: 'Lỗi truy vấn', mesage_en: 'Erro query', Status: false });
    const { status } = req.query;

    try {
        const result = await connectSchema
            .findByIdAndUpdate(
                _id,
                { $set: { status: status } },
                { new: true, runValidators: false }
            );

        if (!result) return res.status(400).json({ mesage_vn: 'Chuyển đổi trạng thái thất bại', mesage_en: 'State transition failed', status: false });
        return res.status(200).json({ mesage_vn: 'Chuyển đổi trạng thái thành công', mesage_en: 'State transition successful', status: true });
    } catch (error) {
        if (error) return next(error);
    }
}



router.post("/add", addNew);
router.post("/login", login);
router.get("/view-All", viewAll);
router.get("/view-One/:id", viewOne);
router.put("/state-Transition/:id", stateTransition);
module.exports = router;