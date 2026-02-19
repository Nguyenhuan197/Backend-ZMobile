const express = require("express");
const router = express.Router();
const Product = require("../Schema/product");


const addProductLogic = async (req, res) => {
    try {
        const { name, price } = req.body;
        if (!name || !price) return res.status(400).json({ mesage_vn: 'Thêm thất bại', mesage_en: 'More failures', status: false });
        const newProduct = new Product({ name, price });
        const result = await newProduct.save();
        if (!result) return res.status(400).json({ mesage_vn: 'Thêm thất bại', mesage_en: 'More failures', status: false })
        return res.status(201).json({ mesage_vn: 'Thêm thành công', mesage_en: 'More success', status: true });

    } catch (error) {
        if (error) return next(error);
    }
};


const getProduct = async (req, res) => {
    try {
        const result = await Product
            .find({})
            .select('name price')
            .limit(20);
        if (result.length === 0) return res.status(400).json({ mesage_vn: 'Truy vấn thất bại', mesage_en: 'Query failed', data: [], status: false });
        return res.status(200).json({ mesage_vn: 'Truy vấn thành công', mesage_en: 'Query successful', data: result, status: false });
    } catch (error) {
        if (error) return next(error);
    }
}




router.post("/add", addProductLogic);
router.get("/view", getProduct);
module.exports = router;