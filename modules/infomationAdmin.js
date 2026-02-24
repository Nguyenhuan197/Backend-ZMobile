const express = require("express");
const router = express.Router();
const connectSchema = require("../Schema/infomationAdmin");
const mongoose = require('mongoose');


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
            .select('nameLogo contact phone nameAdmin address email slogan pageFB ticktock shopee workingHours ');
        if (result.length === 0) return res.status(400).json({ mesage_vn: 'Không có dữ liệu', mesage_en: 'No data found', data: [], status: false });
        return res.status(200).json({ mesage_vn: 'Truy vấn thành công', mesage_en: 'Query successful', data: result, status: true });
    } catch (error) {
        if (error) return next(error);
    }
}

const update = async (req, res, next) => {
    const _id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).json({ mesage_vn: 'Lỗi truy vấn', mesage_en: 'Erro query', Status: false });
    const { nameLogo, contact, phone, nameAdmin, address, email, slogan, pageFB, ticktock, shopee, workingHours } = req.body;
    const dataUpdate = { nameLogo, contact, phone, nameAdmin, address, email, slogan, pageFB, ticktock, shopee, workingHours }

    try {
        const result = await connectSchema
            .findByIdAndUpdate(
                _id,
                { $set: dataUpdate },
                { new: true, runValidators: false }
            );

        if (!result) return res.status(400).json({ mesage_vn: 'Cập nhật thất bại =', mesage_en: 'Update failed', status: false });
        return res.status(200).json({ mesage_vn: 'Cập nhật thành công', mesage_en: 'Update successful', status: true });
    } catch (error) {
        if (error) return next(error);
    }
}


router.post("/add", addNew);
router.get("/view", viewAll);
router.put("/update/:id", update);
module.exports = router;