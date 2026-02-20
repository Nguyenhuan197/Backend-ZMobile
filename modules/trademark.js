const express = require("express");
const router = express.Router();
const connectSchema = require("../Schema/trademark");
const mongoose = require('mongoose');


const addNew = async (req, res, next) => {
    try {
        const { id_Category, name, img } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id_Category)) return res.status(404).json({ mesage_vn: 'Lỗi truy vấn', mesage_en: 'Erro query', Status: false });
        if (!name || !img) return res.status(400).json({ mesage_vn: 'Thêm thất bại', mesage_en: 'More failures', status: false });
        const newData = new connectSchema({ id_Category, name, img });
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
            .populate('id_Category', 'name');
        if (result.length === 0) return res.status(400).json({ mesage_vn: 'Không tìm thấy dữ liệu', mesage_en: 'No data found', data: [], status: false });
        return res.status(200).json({ mesage_vn: 'Truy vấn thành công', mesage_en: 'Query successful', data: result, status: true });
    } catch (error) {
        if (error) return next(error);
    }
}

const deleteOne = async (req, res, next) => {
    const _id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).json({ mesage_vn: 'Lỗi truy vấn', mesage_en: 'Erro query', Status: false });

    try {
        const result = await connectSchema.findByIdAndDelete(_id);
        if (!result) return res.status(400).json({ mesage_vn: 'Xoá thất bại', mesage_en: 'Delete failed', status: false });
        return res.status(200).json({ mesage_vn: 'Xoá thành công', mesage_en: 'Delete successful', status: true });
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
router.delete("/delete/:id", deleteOne);
router.put("/stateTransition/:id", stateTransition);
module.exports = router;