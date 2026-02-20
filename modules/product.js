const express = require("express");
const router = express.Router();
const connectSchema = require("../Schema/product");


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
            .select('name price describe remainingQuantity img imgDetail')
            .populate('id_Trademark', 'name img')
            .limit(20);
        if (result.length === 0) return res.status(201).json({ mesage_vn: 'Không tìm thấy dữ liệu', mesage_en: 'Query failed', data: [], status: false });
        return res.status(200).json({ mesage_vn: 'Truy vấn thành công nhé bạn', mesage_en: 'Query successful', data: result, status: false });
    } catch (error) {
        if (error) return next(error);
    }
}


router.post("/add", addProductLogic);
router.get("/view", getProduct);
module.exports = router;