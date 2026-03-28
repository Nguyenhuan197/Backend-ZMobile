const express = require("express");
const router = express.Router();
const connectSchema = require("../Schema/trademark");
const mongoose = require('mongoose');
const connectSchema__User = require("../Schema/user");
const CheckToken = require("../modules/middlewares/checkToken");
const auth = new CheckToken();



const addNew = async (req, res, next) => {
    const _id = req.params.idUser;
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).json({ error: 'Invalid _id', Status: false, data: [] });

    // Check Token
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = auth.verifyAccessToken(token);
    if (_id !== decoded._id) return res.status(401).json({ message_en: 'You do not have access.', message_vn: 'Bạn không có quyền truy cập', status: false, data: [] });
    const checkRole = await connectSchema__User.findOne({ _id: decoded._id }).select('role');
    if (!checkRole || checkRole.role !== 'Admin') return res.status(401).json({ message_en: 'You do not have access.', message_vn: 'Bạn không có quyền truy cập', status: false, data: [] });


    try {
        const { name, img } = req.body;
        if (!name || !img) return res.status(400).json({ mesage_vn: 'Thêm thất bại', mesage_en: 'More failures', status: false });
        const newData = new connectSchema({ name, img });
        const result = await newData.save();
        if (!result) return res.status(400).json({ mesage_vn: 'Thêm thất bại', mesage_en: 'More failures', status: false })
        return res.status(201).json({ mesage_vn: 'Thêm thành công', mesage_en: 'More success', status: true });
    } catch (error) {
        if (error) return next(error);
    }
};


const viewAll = async (req, res, next) => {
    const { status } = req.query;
    try {
        const result = await connectSchema
            .find({ status })
            .select('name img')
        if (result.length === 0) return res.status(400).json({ mesage_vn: 'Không tìm thấy dữ liệu', mesage_en: 'No data found', data: [], status: false });
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


const update = async (req, res, next) => {
    const _id = req.params.id;
    const idUser = req.params.idUser;
    if (!mongoose.Types.ObjectId.isValid(_id || idUser)) return res.status(404).json({ mesage_vn: 'Lỗi truy vấn', mesage_en: 'Erro query', Status: false });

    // Check Token
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = auth.verifyAccessToken(token);
    if (idUser !== decoded._id) return res.status(401).json({ message_en: 'You do not have access.', message_vn: 'Bạn không có quyền truy cập', status: false, data: [] });
    const checkRole = await connectSchema__User.findOne({ _id: decoded._id }).select('role');
    if (!checkRole || checkRole.role !== 'Admin') return res.status(401).json({ message_en: 'You do not have access.', message_vn: 'Bạn không có quyền truy cập', status: false, data: [] });


    try {
        const name = req.body;
        const result = await connectSchema
            .findByIdAndUpdate(
                _id,
                { $set: name },
                { new: true, runValidators: false }
            );

        if (!result) return res.status(400).json({ mesage_vn: 'Cập nhật thất bại', mesage_en: 'Update failed', status: false });
        return res.status(200).json({ mesage_vn: 'Cập nhật thành công', mesage_en: 'Update successful', status: true });
    } catch (error) {
        if (error) return next(error);
    }
}


router.post("/add/:idUser", addNew);
router.get("/view", viewAll);
router.put("/stateTransition/:id", stateTransition);
router.put("/update/:idUser/:id", update);

module.exports = router;