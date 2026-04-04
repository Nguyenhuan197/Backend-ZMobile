const express = require("express");
const router = express.Router();
const connectSchema = require("../Schema/order");
const OrderItem = require("../Schema/orderItems");
const mongoose = require('mongoose');
const CheckToken = require("../modules/middlewares/checkToken");
const auth = new CheckToken();
const connectSchema__User = require("../Schema/user");



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

const ViewDetailOrder = async (req, res, next) => {
    const id_user = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id_user)) return res.status(404).json({ mesage_vn: 'Lỗi truy vấn', mesage_en: 'Erro query', Status: false });

    try {
        const result = await connectSchema
            .find({ id_user })
            .select('shippingInfo id_user paymentMethod totalPrice')
        if (result.length === 0) return res.status(400).json({ mesage_vn: 'Không có dữ liệu', mesage_en: 'No data found', data: [], status: false });
        return res.status(200).json({ mesage_vn: 'Truy vấn thành công', mesage_en: 'Query successful', data: result, status: true });
    } catch (error) {
        if (error) return next(error);
    }
}


const ViewDetail_ItemOrder = async (req, res, next) => {
    const id_order = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id_order)) return res.status(404).json({ mesage_vn: 'Lỗi truy vấn', mesage_en: 'Erro query', Status: false });

    try {
        const result = await OrderItem
            .find({ id_order })
            .populate('id_product', 'name price img statusOrder shippingCode')
        if (result.length === 0) return res.status(400).json({ mesage_vn: 'Không có dữ liệu', mesage_en: 'No data found', data: [], status: false });
        return res.status(200).json({ mesage_vn: 'Truy vấn thành công', mesage_en: 'Query successful', data: result, status: true });
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


// Phần ADMIN ---
const Admin__viewAll = async (req, res, next) => {
    const idUser = req.params.idUser;
    if (!mongoose.Types.ObjectId.isValid(idUser)) return res.status(404).json({ mesage_vn: 'Lỗi truy vấn', mesage_en: 'Erro query', Status: false });
    const { statusOrder } = req.query;
    if (!statusOrder) return res.status(404).json({ mesage_vn: 'Lỗi hệ thống', mesage_en: 'System error', Status: false });

    // Check Token
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = auth.verifyAccessToken(token);
    if (idUser !== decoded._id) return res.status(401).json({ message_en: 'You do not have access.', message_vn: 'Bạn không có quyền truy cập', status: false, data: [] });
    const checkRole = await connectSchema__User.findOne({ _id: decoded._id }).select('role');
    if (!checkRole || checkRole.role !== 'Admin') return res.status(401).json({ message_en: 'You do not have access.', message_vn: 'Bạn không có quyền truy cập', status: false, data: [] });


    try {
        const find = statusOrder === "All" ? {} : { statusOrder: statusOrder };
        const result = await OrderItem
            .find(find)
            .select('_id id_product shippingCode statusOrder')
            .populate('id_product', 'name price img Shipping')

        if (result.length === 0) return res.status(400).json({ mesage_vn: 'Không có dữ liệu', mesage_en: 'No data found', data: [], status: false });
        return res.status(200).json({ mesage_vn: 'Truy vấn thành công', mesage_en: 'Query successful', data: result, status: true });
    } catch (error) {
        if (error) return next(error);
    }
}


const stateTransition = async (req, res, next) => {
    const _id = req.params.id;
    const idUser = req.params.idUser;
    if (!mongoose.Types.ObjectId.isValid(_id || idUser)) return res.status(404).json({ mesage_vn: 'Lỗi truy vấn', mesage_en: 'Erro query', Status: false });
    const { statusOrder } = req.query;
    if (!statusOrder) return res.status(404).json({ mesage_vn: 'Lỗi hệ thống', mesage_en: 'System error', Status: false });


    // Check Token
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = auth.verifyAccessToken(token);
    if (idUser !== decoded._id) return res.status(401).json({ message_en: 'You do not have access.', message_vn: 'Bạn không có quyền truy cập', status: false, data: [] });
    const checkRole = await connectSchema__User.findOne({ _id: decoded._id }).select('role');
    if (!checkRole || checkRole.role !== 'Admin') return res.status(401).json({ message_en: 'You do not have access.', message_vn: 'Bạn không có quyền truy cập', status: false, data: [] });


    try {
        const result = await OrderItem
            .findByIdAndUpdate(
                _id,
                { $set: { statusOrder: statusOrder } },
                { new: true, runValidators: false }
            );

        if (!result) return res.status(400).json({ mesage_vn: 'Chuyển đổi trạng thái thất bại', mesage_en: 'State transition failed', status: false });
        return res.status(200).json({ mesage_vn: 'Chuyển đổi trạng thái thành công', mesage_en: 'State transition successful', status: true });
    } catch (error) {
        if (error) return next(error);
    }
}



const Admin_viewDetail_ItemOrder = async (req, res, next) => {
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
        const result = await OrderItem
            .findOne({ _id })
            .populate('id_product', 'name price img statusOrder shippingCode')

        console.log(result);
        if (!result) return res.status(400).json({ mesage_vn: 'Không có dữ liệu', mesage_en: 'No data found', data: [], status: false });
        return res.status(200).json({ mesage_vn: 'Truy vấn thành công', mesage_en: 'Query successful', data: result, status: true });
    } catch (error) {
        if (error) return next(error);
    }
}


const handleSearchOrderAdmin = async (req, res, next) => {
    const code = req.params.id;
    const idUser = req.params.idUser;
    if (!mongoose.Types.ObjectId.isValid(idUser)) return res.status(404).json({ mesage_vn: 'Lỗi truy vấn', mesage_en: 'Erro query', Status: false });
    if (!code) return res.status(400).json({ mesage_vn: 'Vui lòng cung cấp mã đơn hàng', status: false });

    // Check Token
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = auth.verifyAccessToken(token);
    if (idUser !== decoded._id) return res.status(401).json({ message_en: 'You do not have access.', message_vn: 'Bạn không có quyền truy cập', status: false, data: [] });
    const checkRole = await connectSchema__User.findOne({ _id: decoded._id }).select('role');
    if (!checkRole || checkRole.role !== 'Admin') return res.status(401).json({ message_en: 'You do not have access.', message_vn: 'Bạn không có quyền truy cập', status: false, data: [] });

    try {
        const resultOrder = await OrderItem
            .findOne({ shippingCode: code })
            .select('id_product priceAtPurchase statusOrder')
            .populate('id_product', 'name price img')
            .populate('id_order', 'paymentMethod id_user')

        const resultUser = await connectSchema__User
            .findOne({ _id: resultOrder.id_order.id_user })
            .select('name phone email image deliveryAddress updatedAt');

        if (!resultOrder) return res.status(400).json({ mesage_vn: 'Không có dữ liệu', mesage_en: 'No data found', data: [], status: false });
        return res.status(200).json({ mesage_vn: 'Truy vấn thành công', mesage_en: 'Query successful', data: { dataOrder: resultOrder, dataUser: resultUser }, status: true });

    } catch (error) {
        if (error) return next(error);
    }
}



// ## Cline 
router.post("/add", addNew); // Thêm mới đơn hàng
router.get("/listOrder-UserOne/:id", ViewDetailOrder); // danh sách đơn hàng tài khoản
router.get("/viewDetail_itemOrder/:id", ViewDetail_ItemOrder); // xem chi tiết đơn hàng nhỏ
router.get("/serch-order-item/:id", handleSearchOrder); // tìm kiếm đơn hàng


// ### Admin
router.get("/Admin-viewAll/:idUser", Admin__viewAll); // view tất cả danh sách đơn hàng
router.get("/Admin-viewAll-detail/:idUser/:id", Admin_viewDetail_ItemOrder); // xem chi tiết danh sách đơn hàng
router.put("/Admin-state-Transition/:idUser/:id", stateTransition); // chuyển đổi trạng thái đơn hàng
router.get("/Admin-serch-order-item/:idUser/:id", handleSearchOrderAdmin); // tìm kiếm đơn hàng
module.exports = router;