

const express = require("express");
const router = express.Router();
const connectSchema = require("../Schema/recruitment");
const mongoose = require('mongoose');
const connectSchema__User = require("../Schema/user");
const CheckToken = require("../modules/middlewares/checkToken");
const auth = new CheckToken();



const addNew = async (req, res, next) => {
    const { name, sex, age, phone, city } = req.body;
    if (!name.trim() || !sex.trim() || !age || !phone.trim() || !city.trim()) return res.status(400).json({ mesage_vn: 'Ứng tuyển thất bại', mesage_en: 'Apply success', status: false });

    try {
        const newProduct = new connectSchema({ name, sex, age, phone, city });
        const result = await newProduct.save();
        if (!result) return res.status(400).json({ mesage_vn: 'Ứng tuyển thất bại', mesage_en: 'Apply failures', status: false })
        return res.status(201).json({ mesage_vn: 'Ứng tuyển thành công', mesage_en: 'Apply success', status: true });
    } catch (error) {
        if (error) return next(error);
    }
};


const viewAll = async (req, res, next) => {
    const { status } = req.query;
    const _id = req.params.idUser;
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).json({ error: 'Invalid _id', Status: false, data: [] });

    // Check Token
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = auth.verifyAccessToken(token);
    if (_id !== decoded._id) return res.status(401).json({ message_en: 'You do not have access.', message_vn: 'Bạn không có quyền truy cập', status: false, data: [] });
    const checkRole = await connectSchema__User.findOne({ _id: decoded._id }).select('role');
    if (!checkRole || checkRole.role !== 'Admin') return res.status(401).json({ message_en: 'You do not have access.', message_vn: 'Bạn không có quyền truy cập', status: false, data: [] });


    try {
        const result = await connectSchema
            .find({ status })
        if (result.length === 0) return res.status(200).json({ mesage_vn: 'Không tìm thấy dữ liệu', mesage_en: 'No data found', data: [], status: false });
        return res.status(200).json({ mesage_vn: 'Truy vấn thành công', mesage_en: 'Query successful', data: result, status: true });
    } catch (error) {
        if (error) return next(error);
    }
}


const stateTransition = async (req, res, next) => {
    const _id = req.params.id;
    const idUser = req.params.idUser;
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).json({ mesage_vn: 'Lỗi truy vấn', mesage_en: 'Erro query', Status: false });
    const { status } = req.query;

    // Check Token
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = auth.verifyAccessToken(token);
    if (idUser !== decoded._id) return res.status(401).json({ message_en: 'You do not have access.', message_vn: 'Bạn không có quyền truy cập', status: false, data: [] });
    const checkRole = await connectSchema__User.findOne({ _id: decoded._id }).select('role');
    if (!checkRole || checkRole.role !== 'Admin') return res.status(401).json({ message_en: 'You do not have access.', message_vn: 'Bạn không có quyền truy cập', status: false, data: [] });


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


const deleteUser = async (req, res, next) => {
    const id = req.params.id;
    const idUser = req.params.idUser;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ mesage_vn: 'Lỗi truy vấn', mesage_en: 'Erro query', Status: false });


    // Check Token
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = auth.verifyAccessToken(token);
    if (idUser !== decoded._id) return res.status(401).json({ message_en: 'You do not have access.', message_vn: 'Bạn không có quyền truy cập', status: false, data: [] });
    const checkRole = await connectSchema__User.findOne({ _id: decoded._id }).select('role');
    if (!checkRole || checkRole.role !== 'Admin') return res.status(401).json({ message_en: 'You do not have access.', message_vn: 'Bạn không có quyền truy cập', status: false, data: [] });


    try {
        const result = await connectSchema.findByIdAndDelete(id);
        if (!result) return res.status(400).json({ mesage_vn: 'Từ chối thất bại', mesage_en: 'Refuse to fail', status: false });
        return res.status(200).json({ mesage_vn: 'Từ chối thành công', mesage_en: 'Rejected successfully', status: true });
    } catch (error) {
        if (error) return next(error);
    }
}




router.post("/add-new", addNew);
router.get("/view/:idUser", viewAll);
router.put("/stateTransition/:id/:idUser", stateTransition);
router.delete("/delete/:id/:idUser", deleteUser);
module.exports = router;