const express = require("express");
const router = express.Router();
const connectSchema = require("../Schema/order");
const OrderItem = require("../Schema/orderItems");
const mongoose = require('mongoose');



const addNew = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const {
            id_user,
            cartItems,
            shippingInfo,

            paymentMethod,
            totalPrice,
            shippingFee
        } = req.body;

        if (!id_user || !cartItems || cartItems.length === 0) return res.status(400).json({ mesage_vn: 'Giỏ hàng trống', status: false });

        // 2. Tạo hóa đơn tổng (Bảng Order)
        const newOrder = new connectSchema({ id_user, shippingInfo, paymentMethod, totalPrice, shippingFee, statusOrder: 'Awaiting confirmation' });
        const savedOrder = await newOrder.save({ session });
        const orderItemsData = cartItems.map(item => ({
            id_order: savedOrder._id,
            id_product: item.id_product,
            quantity: item.quantity,
            priceAtPurchase: item.priceAtPurchase
        }));

        await OrderItem.insertMany(orderItemsData, { session });

        // 4. Nếu mọi thứ OK, xác nhận lưu vào Database
        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
            mesage_vn: 'Đặt hàng thành công',
            orderId: savedOrder._id,
            status: true
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({
            mesage_vn: 'Lỗi hệ thống khi đặt hàng',
            error: error.message,
            status: false
        });
    }
};


const Admin__viewAll = async (req, res, next) => {
    try {
        const result = await connectSchema
            .find({})
            .select('shippingInfo id_user paymentMethod totalPrice statusOrder')
        if (result.length === 0) return res.status(400).json({ mesage_vn: 'Không có dữ liệu', mesage_en: 'No data found', data: [], status: false });
        return res.status(200).json({ mesage_vn: 'Truy vấn thành công', mesage_en: 'Query successful', data: result, status: true });
    } catch (error) {
        if (error) return next(error);
    }
}

const Admin_viewDetail = async (req, res, next) => {
    const id_user = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id_user)) return res.status(404).json({ mesage_vn: 'Lỗi truy vấn', mesage_en: 'Erro query', Status: false });

    try {
        const result = await connectSchema
            .find({ id_user })
            .select('shippingInfo id_user paymentMethod totalPrice statusOrder')
        if (result.length === 0) return res.status(400).json({ mesage_vn: 'Không có dữ liệu', mesage_en: 'No data found', data: [], status: false });
        return res.status(200).json({ mesage_vn: 'Truy vấn thành công', mesage_en: 'Query successful', data: result, status: true });
    } catch (error) {
        if (error) return next(error);
    }
}


const Admin_viewDetail_ItemOrder = async (req, res, next) => {
    const id_order = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id_order)) return res.status(404).json({ mesage_vn: 'Lỗi truy vấn', mesage_en: 'Erro query', Status: false });

    try {
        const result = await OrderItem
            .find({ id_order })
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

const handleSearchOrder = async (req, res, next) => {
    const code = req.params.id;
    if (!code) {
        return res.status(400).json({
            mesage_vn: 'Vui lòng cung cấp mã đơn hàng',
            status: false
        });
    }

    try {
        const result = await OrderItem
            .findOne({ shippingCode: code })
            .select('id_product priceAtPurchase statusOrder')
            .populate('id_product', 'name price img')

        if (!result) return res.status(400).json({ mesage_vn: 'Không có dữ liệu', mesage_en: 'No data found', data: [], status: false });
        return res.status(200).json({ mesage_vn: 'Truy vấn thành công', mesage_en: 'Query successful', data: result, status: true });

    } catch (error) {
        if (error) return next(error);
    }
}



// ## Cline 
router.post("/add", addNew);
router.get("/Admin_viewDetail/:id", Admin_viewDetail);
router.get("/Admin_viewDetail_itemOrder/:id", Admin_viewDetail_ItemOrder);
router.get("/serch-order-item/:id", handleSearchOrder);


// ### Admin
// -- danh sách đơn hàng
router.get("/Admin__viewAll", Admin__viewAll);
router.put("/state-Transition/:id", stateTransition);
module.exports = router;