const express = require("express");
const router = express.Router();
const connectSchema = require("../Schema/product");
const mongoose = require('mongoose');


const addProductLogic = async (req, res, next) => {
    try {
        const { id_Trademark, name, price, describe, remainingQuantity, img, imgDetail } = req.body;
        const newData = new connectSchema({ id_Trademark, name, price, describe, remainingQuantity, img, imgDetail })
        const result = await newData.save();
        if (!result) return res.status(400).json({ mesage_vn: 'Thêm thất bại', mesage_en: 'More failures', status: false })
        return res.status(201).json({ mesage_vn: 'Thêm thành công', mesage_en: 'More success', status: true });

    } catch (error) {
        if (error) return next(error);
    }
};

const getProduct = async (req, res, next) => {
    const { status } = req.query;
    try {
        const result = await connectSchema
            .find({ status })
            .select('name price img')
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
            .find({ _id })
            .select('name price describe remainingQuantity img imgDetail')
            .populate('id_Trademark', 'name img');

        if (result.length === 0) return res.status(201).json({ mesage_vn: 'Không tìm thấy dữ liệu', mesage_en: 'Query failed', data: [], status: false });
        return res.status(200).json({ mesage_vn: 'Truy vấn thành công nhé bạn', mesage_en: 'Query successful', data: result, status: false });
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



router.post("/add", addProductLogic);
router.get("/view", getProduct);
router.get("/viewDetail/:id", getProductDetail);
router.put("/state-Transition/:id", stateTransition);
module.exports = router;