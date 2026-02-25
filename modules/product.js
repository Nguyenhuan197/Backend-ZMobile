const express = require("express");
const router = express.Router();
const connectSchema = require("../Schema/product");
const mongoose = require('mongoose');

const CheckToken = require("../modules/middlewares/checkToken");
const auth = new CheckToken();
const connectSchema__User = require("../Schema/user");



const addProductLogic = async (req, res, next) => {
    try {
        const { id_Trademark, name, price, describe, remainingQuantity, img, imgDetail, present } = req.body;
        const newData = new connectSchema({ id_Trademark, name, price, describe, remainingQuantity, img, imgDetail, present })
        const result = await newData.save();
        if (!result) return res.status(400).json({ mesage_vn: 'Thêm thất bại', mesage_en: 'More failures', status: false })
        return res.status(201).json({ mesage_vn: 'Thêm thành công', mesage_en: 'More success', status: true });

    } catch (error) {
        if (error) return next(error);
    }
};


const getProduct_Phone = async (req, res, next) => {
    const { status } = req.query;
    try {
        const result = await connectSchema
            .find({
                status,
                id_Trademark: {
                    $ne: new mongoose.Types.ObjectId("699eb6d3dfb6f292d07d88c9")
                }
            })
            .select('name price priceSale img')
            .limit(20);
        if (result.length === 0) return res.status(201).json({ mesage_vn: 'Không tìm thấy dữ liệu', mesage_en: 'Query failed', data: [], status: false });
        return res.status(200).json({ mesage_vn: 'Truy vấn thành công nhé bạn', mesage_en: 'Query successful', data: result, status: false });
    } catch (error) {
        if (error) return next(error);
    }
}


const getProduct_Accessory = async (req, res, next) => {
    const { status } = req.query;
    try {
        const result = await connectSchema
            .find({
                status,
                id_Trademark: new mongoose.Types.ObjectId("699eb6d3dfb6f292d07d88c9")
            })
            .select('name price priceSale img')
            .limit(20);
        if (result.length === 0) return res.status(201).json({ mesage_vn: 'Không tìm thấy dữ liệu', mesage_en: 'Query failed', data: [], status: false });
        return res.status(200).json({ mesage_vn: 'Truy vấn thành công nhé bạn', mesage_en: 'Query successful', data: result, status: false });
    } catch (error) {
        if (error) return next(error);
    }
}


const getProductDetail = async (req, res, next) => {
    const _id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).json({ mesage_vn: 'Lỗi truy vấn', mesage_en: 'Erro query', Status: false });

    try {
        const result = await connectSchema
            .findById({ _id })
            .select('name price describe remainingQuantity img imgDetail present')
            .populate('id_Trademark', 'name img');

        const productRelateTo = await connectSchema
            .find({
                id_Trademark: result.id_Trademark._id,
                _id: { $ne: result._id }   // loại bỏ sản phẩm hiện tại
            })
            .select('name price img')
            .limit(4);

        if (result.length === 0) return res.status(201).json({ mesage_vn: 'Không tìm thấy dữ liệu', mesage_en: 'Query failed', data: [], status: false });
        return res.status(200).json({ mesage_vn: 'Truy vấn thành công nhé bạn', mesage_en: 'Query successful', data: result, status: true, similarProducts: productRelateTo });
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

const searchProduct = async (req, res, next) => {
    const { keySearch } = req.query;
    try {
        const searchRegex = new RegExp(keySearch, 'i');
        const result = await connectSchema.find({
            name: { $regex: searchRegex }
        });

        if (!result) return res.status(400).json({ mesage_vn: 'Tìm kiếm thất bại', mesage_en: 'Product not found', status: false, data: [] });
        return res.status(200).json({ mesage_vn: 'Tìm kiếm thành công', mesage_en: 'Search successful', status: true, data: result });
    } catch (error) {
        if (error) return next(error);
    }
}


const Admin_SelectProduct = async (req, res, next) => {
    const { status } = req.query;
    const _id = req.params.id;
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
            .select('name price img imgDetail')
            .limit(20);
        if (result.length === 0) return res.status(201).json({ mesage_vn: 'Không tìm thấy dữ liệu', mesage_en: 'Query failed', data: [], status: false });
        return res.status(200).json({ mesage_vn: 'Truy vấn thành công nhé bạn', mesage_en: 'Query successful', data: result, status: false });
    } catch (error) {
        if (error) return next(error);
    }
}


const Admin__DetailProduct = async (req, res, next) => {
    const _id = req.params.id;
    const idUser = req.params.idUser;
    if (!mongoose.Types.ObjectId.isValid(_id || idUser)) return res.status(404).json({ error: 'Invalid _id', Status: false, data: [] });

    // Check Token
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = auth.verifyAccessToken(token);
    if (idUser !== decoded._id) return res.status(401).json({ message_en: 'You do not have access.', message_vn: 'Bạn không có quyền truy cập', status: false, data: [] });
    const checkRole = await connectSchema__User.findOne({ _id: decoded._id }).select('role');
    if (!checkRole || checkRole.role !== 'Admin') return res.status(401).json({ message_en: 'You do not have access.', message_vn: 'Bạn không có quyền truy cập', status: false, data: [] });

    try {
        const result = await connectSchema
            .find({ _id })
            .limit(20);
        if (result.length === 0) return res.status(201).json({ mesage_vn: 'Không tìm thấy dữ liệu', mesage_en: 'Query failed', data: [], status: false });
        return res.status(200).json({ mesage_vn: 'Truy vấn thành công nhé bạn', mesage_en: 'Query successful', data: result, status: false });
    } catch (error) {
        if (error) return next(error);
    }
}


const advertisement = async (req, res, next) => {
    try {
        const result = await connectSchema
            .find({ advertisement: true })
            .select('name price img priceSale')
            .limit(8);
        if (result.length === 0) return res.status(201).json({ mesage_vn: 'Không tìm thấy dữ liệu', mesage_en: 'Query failed', data: [], status: false });
        return res.status(200).json({ mesage_vn: 'Truy vấn thành công nhé bạn', mesage_en: 'Query successful', data: result, status: false });
    } catch (error) {
        if (error) return next(error);
    }
}


const transitionAdvertisement = async (req, res, next) => {
    const _id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).json({ mesage_vn: 'Lỗi truy vấn', mesage_en: 'Erro query', Status: false });
    const { status } = req.query;

    try {
        const result = await connectSchema
            .findByIdAndUpdate(
                _id,
                { $set: { advertisement: status } },
                { new: true, runValidators: false }
            );

        if (!result) return res.status(400).json({ mesage_vn: 'Chuyển đổi trạng thái thất bại', mesage_en: 'State transition failed', status: false });
        return res.status(200).json({ mesage_vn: 'Chuyển đổi trạng thái thành công', mesage_en: 'State transition successful', status: true });
    } catch (error) {
        if (error) return next(error);
    }
}



// Cline
router.post("/add", addProductLogic);
router.get("/view-product-phone", getProduct_Phone);
router.get("/view-product-accessory", getProduct_Accessory);

//
router.get("/viewDetail/:id", getProductDetail);
router.get("/search-Product", searchProduct);
router.get("/view-advertisement", advertisement);


// Admin
router.get("/admin-SelectAll/:id", Admin_SelectProduct);
router.get("/admin-Detail/:id/:idUser", Admin__DetailProduct);
router.put("/state-Transition/:id", stateTransition);
router.put("/state-Transition-advertisement/:id", transitionAdvertisement);
module.exports = router;