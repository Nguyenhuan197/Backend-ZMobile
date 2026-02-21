const express = require("express");
const router = express.Router();
const connectSchema = require("../Schema/order");
const mongoose = require('mongoose');


const addNew = async (req, res, next) => {
    try {
        const { id_user, id_product, numberOrder, sumPrice } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id_user) || !mongoose.Types.ObjectId.isValid(id_product))
            return res.status(404).json({ mesage_vn: 'Lỗi hệ thống', mesage_en: 'System error', Status: false });
        if (!numberOrder || !sumPrice) return res.status(400).json({ mesage_vn: 'Thêm thất bại', mesage_en: 'More failures', status: false });

        const newProduct = new connectSchema({ id_user, id_product, numberOrder, sumPrice });
        const result = await newProduct.save();
        if (!result) return res.status(400).json({ mesage_vn: 'Thêm thất bại', mesage_en: 'More failures', status: false })
        return res.status(201).json({ mesage_vn: 'Thêm thành công', mesage_en: 'More success', status: true });
    } catch (error) {
        if (error) return next(error);
    }
};


const viewDetail = async (req, res, next) => {
    const _id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).json({ mesage_vn: 'Lỗi truy vấn', mesage_en: 'Erro query', Status: false });

    try {
        const result = await connectSchema
            .findOne({ _id })
            .select('numberOrder sumPrice status')
            .populate('id_user', 'name phone')
            .populate('id_product', 'name price img')

        if (result.length === 0) return res.status(400).json({ mesage_vn: 'Không có dữ liệu', mesage_en: 'No data found', data: [], status: false });
        return res.status(200).json({ mesage_vn: 'Truy vấn thành công', mesage_en: 'Query successful', data: result, status: true });
    } catch (error) {
        if (error) return next(error);
    }
}


const viewAll = async (req, res, next) => {
    try {
        const result = await connectSchema
            .find({})
            .select('numberOrder sumPrice')
            .populate('id_user', 'name phone')
            .populate('id_product', 'name price img')
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
router.get("/view", viewAll);
router.get("/view-Detail/:id", viewDetail);
router.put("/state-Transition/:id", stateTransition);
module.exports = router;