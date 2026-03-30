

const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const connectSchema = require("../Schema/contacts");
const connectSchema__User = require("../Schema/user");
const CheckToken = require("../modules/middlewares/checkToken");
const auth = new CheckToken();



const addNew = async (req, res, next) => {
    const { name, email, phone, content, idUser } = req.body;
    if (!mongoose.Types.ObjectId.isValid(idUser)) return res.status(404).json({ error: 'Invalid _id', Status: false, data: [] })

    try {
        if (!name || !email || !phone || !content) return res.status(400).json({ mesage_vn: 'Thêm thất bại', mesage_en: 'More failures', status: false });
        const newData = new connectSchema({ name, email, phone, content, idUser });
        const result = await newData.save();
        if (!result) return res.status(400).json({ mesage_vn: 'Thêm thất bại', mesage_en: 'More failures', status: false })
        return res.status(201).json({ mesage_vn: 'Thêm thành công', mesage_en: 'More success', status: true });
    } catch (error) {
        if (error) return next(error);
    }
};

const viewAll_Admin = async (req, res, next) => {
    const { status } = req.query;
    const idUser = req.params.idUser;
    if (!mongoose.Types.ObjectId.isValid(idUser)) return res.status(404).json({ mesage_vn: 'Lỗi truy vấn', mesage_en: 'Erro query', Status: false });

    // Check Token
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = auth.verifyAccessToken(token);
    if (idUser !== decoded._id) return res.status(401).json({ message_en: 'You do not have access.', message_vn: 'Bạn không có quyền truy cập', status: false, data: [] });
    const checkRole = await connectSchema__User.findOne({ _id: decoded._id }).select('role');
    if (!checkRole || checkRole.role !== 'Admin') return res.status(401).json({ message_en: 'You do not have access.', message_vn: 'Bạn không có quyền truy cập', status: false, data: [] });


    try {
        const result = await connectSchema
            .find({ status })
        if (result.length === 0) return res.status(400).json({ mesage_vn: 'Không tìm thấy dữ liệu', mesage_en: 'No data found', data: [], status: false });
        return res.status(200).json({ mesage_vn: 'Truy vấn thành công', mesage_en: 'Query successful', data: result, status: true });
    } catch (error) {
        if (error) return next(error);
    }
}

const stateTransitionAdmin = async (req, res, next) => {
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
router.get("/view-admin/:idUser", viewAll_Admin);
router.put("/stateTransition-admin/:id", stateTransitionAdmin);
module.exports = router;