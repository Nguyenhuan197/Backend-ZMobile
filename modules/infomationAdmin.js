const express = require("express");
const router = express.Router();
const connectSchema = require("../Schema/infomationAdmin");
const mongoose = require('mongoose');
const connectSchema__User = require("../Schema/user");
const CheckToken = require("../modules/middlewares/checkToken");
const auth = new CheckToken();


const addNew = async (req, res, next) => {
    try {
        const { nameLogo, contact, phone, nameAdmin, address, email, slogan, pageFB, ticktock, shopee, workingHours } = req.body;
        const newProduct = new connectSchema({ nameLogo, contact, phone, nameAdmin, address, email, slogan, pageFB, ticktock, shopee, workingHours });
        const result = await newProduct.save();
        if (!result) return res.status(400).json({ mesage_vn: 'Thêm thất bại', mesage_en: 'More failures', status: false })
        return res.status(201).json({ mesage_vn: 'Thêm thành công', mesage_en: 'More success', status: true });

    } catch (error) {
        if (error) return next(error);
    }
};


const viewAll = async (req, res, next) => {
    try {
        const result = await connectSchema
            .find({})
            .select('nameLogo contact phone nameAdmin address email slogan pageFB ticktock shopee chotot workingHours partnerDelivery accountStatus');
        if (result.length === 0) return res.status(400).json({ mesage_vn: 'Không có dữ liệu', mesage_en: 'No data found', data: [], status: false });
        return res.status(200).json({ mesage_vn: 'Truy vấn thành công', mesage_en: 'Query successful', data: result, status: true });
    } catch (error) {
        if (error) return next(error);
    }
}

const viewAdmin = async (req, res, next) => {
    const _idUser = req.params.idUser;
    if (!mongoose.Types.ObjectId.isValid(_idUser)) return res.status(404).json({ mesage_vn: 'Lỗi truy vấn', mesage_en: 'Erro query', Status: false });

    // Check Token
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = auth.verifyAccessToken(token);
    if (_idUser !== decoded._id) return res.status(401).json({ message_en: 'You do not have access.', message_vn: 'Bạn không có quyền truy cập', status: false, data: [] });
    const checkRole = await connectSchema__User.findOne({ _id: decoded._id }).select('role');
    if (!checkRole || checkRole.role !== 'Admin') return res.status(401).json({ message_en: 'You do not have access.', message_vn: 'Bạn không có quyền truy cập', status: false, data: [] });

    try {
        const result = await connectSchema
            .find({})
            .select('nameLogo contact phone nameAdmin address email slogan pageFB ticktock shopee chotot workingHours partnerDelivery accountStatus');
        if (result.length === 0) return res.status(400).json({ mesage_vn: 'Không có dữ liệu', mesage_en: 'No data found', data: [], status: false });
        return res.status(200).json({ mesage_vn: 'Truy vấn thành công', mesage_en: 'Query successful', data: result, status: true });
    } catch (error) {
        if (error) return next(error);
    }
}


const update = async (req, res, next) => {
    const _id = req.params.id;
    const _idUser = req.params.idUser;
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).json({ mesage_vn: 'Lỗi truy vấn', mesage_en: 'Erro query', Status: false });
    const {
        nameLogo, contact, phone, nameAdmin, address, email, slogan, pageFB, ticktock, shopee, chotot, workingHours, partnerDelivery
    } = req.body;
    const dataUpdate = { nameLogo, contact, phone, nameAdmin, address, email, slogan, pageFB, ticktock, shopee, chotot, workingHours, partnerDelivery }


    // Check Token
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = auth.verifyAccessToken(token);
    if (_idUser !== decoded._id) return res.status(401).json({ message_en: 'You do not have access.', message_vn: 'Bạn không có quyền truy cập', status: false, data: [] });
    const checkRole = await connectSchema__User.findOne({ _id: decoded._id }).select('role');
    if (!checkRole || checkRole.role !== 'Admin') return res.status(401).json({ message_en: 'You do not have access.', message_vn: 'Bạn không có quyền truy cập', status: false, data: [] });

    try {
        const result = await connectSchema
            .findByIdAndUpdate(
                _id,
                { $set: dataUpdate },
                { new: true, runValidators: false }
            );

        if (!result) return res.status(400).json({ mesage_vn: 'Cập nhật thất bại', mesage_en: 'Update failed', status: false });
        return res.status(200).json({ mesage_vn: 'Cập nhật thành công', mesage_en: 'Update successful', status: true });
    } catch (error) {
        if (error) return next(error);
    }
}


const stateTransition = async (req, res, next) => {
    const _id = req.params.id;
    const _idUser = req.params.idUser;
    const { status } = req.query;
    if (!mongoose.Types.ObjectId.isValid(_id || _idUser)) return res.status(404).json({ mesage_vn: 'Lỗi truy vấn', mesage_en: 'Erro query', Status: false });


    // Check Token
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = auth.verifyAccessToken(token);
    if (_idUser !== decoded._id) return res.status(401).json({ message_en: 'You do not have access.', message_vn: 'Bạn không có quyền truy cập', status: false, data: [] });
    const checkRole = await connectSchema__User.findOne({ _id: decoded._id }).select('role');
    if (!checkRole || checkRole.role !== 'Admin') return res.status(401).json({ message_en: 'You do not have access.', message_vn: 'Bạn không có quyền truy cập', status: false, data: [] });


    try {
        const result = await connectSchema
            .findByIdAndUpdate(
                _id,
                { $set: { accountStatus: status } },
                { new: true, runValidators: false }
            );

        if (!result) return res.status(400).json({ mesage_vn: 'Cập nhật thất bại', mesage_en: 'Update failed', status: false });
        return res.status(200).json({ mesage_vn: 'Cập nhật thành công', mesage_en: 'Update successful', status: true });
    } catch (error) {
        if (error) return next(error);
    }
}



router.post("/add", addNew);
router.get("/view", viewAll);

// admin
router.get("/admin-view/:idUser", viewAdmin);
router.put("/update/:id/:idUser", update);
router.put("/handle-state-transition/:id/:idUser", stateTransition);
module.exports = router;