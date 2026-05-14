const express = require("express");
const router = express.Router();
const connectSchema = require("../Schema/product");
const mongoose = require('mongoose');
const CheckToken = require("../modules/middlewares/checkToken");
const auth = new CheckToken();
const connectSchema__User = require("../Schema/user");



// Danh sách sản phẩm điện thoại
const getProduct_Phone = async (req, res, next) => {
    const { status } = req.query;
    try {
        const result = await connectSchema
            .find({
                status,
                id_Trademark: {
                    $ne: new mongoose.Types.ObjectId("699eb6d3dfb6f292d07d88c9")
                },
                priceSale: 0
            })
            .select('name price priceSale img remainingQuantity sold')
            .limit(50);
        if (result.length === 0) return res.status(201).json({ mesage_vn: 'Không tìm thấy dữ liệu', mesage_en: 'Query failed', data: [], status: false });
        return res.status(200).json({ mesage_vn: 'Truy vấn thành công nhé bạn', mesage_en: 'Query successful', data: result, status: false });
    } catch (error) {
        if (error) return next(error);
    }
}


// Danh sách sản phẩm điện thoại
const getProduct_Loudspeaker = async (req, res, next) => {
    const { status } = req.query;
    try {
        const result = await connectSchema
            .find({
                status,
                id_Trademark: {
                    $ne: new mongoose.Types.ObjectId("6a00b3c8fd14f9373e1e5448")
                },
                priceSale: 0
            })
            .select('name price priceSale img remainingQuantity sold')
            .limit(50);
        if (result.length === 0) return res.status(201).json({ mesage_vn: 'Không tìm thấy dữ liệu', mesage_en: 'Query failed', data: [], status: false });
        return res.status(200).json({ mesage_vn: 'Truy vấn thành công nhé bạn', mesage_en: 'Query successful', data: result, status: false });
    } catch (error) {
        if (error) return next(error);
    }
}



// danh sách sản phẩm phụ kiện
const getProduct_Accessory = async (req, res, next) => {
    const { status } = req.query;
    try {
        const result = await connectSchema
            .find({
                status,
                id_Trademark: new mongoose.Types.ObjectId("699eb6d3dfb6f292d07d88c9"),
                priceSale: 0
            })
            .select('name price priceSale img remainingQuantity sold')
            .limit(50);
        if (result.length === 0) return res.status(201).json({ mesage_vn: 'Không tìm thấy dữ liệu', mesage_en: 'Query failed', data: [], status: false });
        return res.status(200).json({ mesage_vn: 'Truy vấn thành công nhé bạn', mesage_en: 'Query successful', data: result, status: false });
    } catch (error) {
        if (error) return next(error);
    }
}


const TrademarkPrduct = async (req, res, next) => {
    const { status } = req.query;
    try {
        const result = await connectSchema
            .find({
                status,
                id_Trademark: new mongoose.Types.ObjectId("6a00b3c8fd14f9373e1e5448"),
                priceSale: 0
            })
            .select('name price priceSale img remainingQuantity sold')
            .limit(50);
        if (result.length === 0) return res.status(201).json({ mesage_vn: 'Không tìm thấy dữ liệu', mesage_en: 'Query failed', data: [], status: false });
        return res.status(200).json({ mesage_vn: 'Truy vấn thành công nhé bạn', mesage_en: 'Query successful', data: result, status: false });
    } catch (error) {
        if (error) return next(error);
    }
}



// Chi tiết sản phẩm
const getProductDetail = async (req, res, next) => {
    const _id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).json({ mesage_vn: 'Lỗi truy vấn', mesage_en: 'Erro query', Status: false });

    try {
        const result = await connectSchema
            .findById({ _id })
            .populate('id_Trademark', 'name img');

        if (!result) return res.status(201).json({ mesage_vn: 'Không tìm thấy dữ liệu', mesage_en: 'Query failed', data: [], status: false });
        const productRelateTo = await connectSchema
            .find({
                status: true,
                id_Trademark: result.id_Trademark._id,
                _id: { $ne: _id }
            })
            .select('name price img sold remainingQuantity')
            .limit(8);

        if (result.length === 0) return res.status(201).json({ mesage_vn: 'Không tìm thấy dữ liệu', mesage_en: 'Query failed', data: [], status: false });
        return res.status(200).json({ mesage_vn: 'Truy vấn thành công nhé bạn', mesage_en: 'Query successful', data: result, status: true, similarProducts: productRelateTo });
    } catch (error) {
        if (error) return next(error);
    }
}


// chuyển đổi trạng thái
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

// tìm kiếm sản phẩm 
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


const advertisement = async (req, res, next) => {
    try {
        const result = await connectSchema
            .find({ advertisement: true, status: true })
            .select('name price img priceSale remainingQuantity sold')
            .limit(8);
        if (result.length === 0) return res.status(201).json({ mesage_vn: 'Không tìm thấy dữ liệu', mesage_en: 'Query failed', data: [], status: false });
        return res.status(200).json({ mesage_vn: 'Truy vấn thành công nhé bạn', mesage_en: 'Query successful', data: result, status: false });
    } catch (error) {
        if (error) return next(error);
    }
}




// Sản phẩm SEO ĐĂNG TRONG CHƯƠNG TRÌNH GIẢM GIÁ
const salePrice = async (req, res, next) => {
    try {
        const result = await connectSchema
            .find({
                status: true,
                priceSale: { $gt: 1 } // Sửa lỗi cú pháp so sánh ở đây
            })
            .select('name price img priceSale remainingQuantity sold')
            .limit(10);
        if (result.length === 0) return res.status(201).json({ mesage_vn: 'Không tìm thấy dữ liệu', mesage_en: 'Query failed', data: [], status: false });
        return res.status(200).json({ mesage_vn: 'Truy vấn thành công nhé bạn', mesage_en: 'Query successful', data: result, status: false });
    } catch (error) {
        if (error) return next(error);
    }
}




// -------------- ADMIN ------------------
const addProductLogic = async (req, res, next) => {
    const _id = req.params.idUser;
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).json({ error: 'Invalid _id', Status: false, data: [] });

    // Check Token
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = auth.verifyAccessToken(token);
    if (_id !== decoded._id) return res.status(401).json({ message_en: 'You do not have access.', message_vn: 'Bạn không có quyền truy cập', status: false, data: [] });
    const checkRole = await connectSchema__User.findOne({ _id: decoded._id }).select('role');
    if (!checkRole || checkRole.role !== 'Admin') return res.status(401).json({ message_en: 'You do not have access.', message_vn: 'Bạn không có quyền truy cập', status: false, data: [] });


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



// Phần quản trị - danh sách sản phẩm
const Admin_SelectProduct = async (req, res, next) => {
    const { status } = req.query;
    const _id = req.params.idUser;
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).json({ error: 'Invalid _id', Status: false, data: [] });

    // Check Token
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = auth.verifyAccessToken(token);
    if (_id !== decoded._id) return res.status(401).json({ message_en: 'You do not have access.', message_vn: 'Bạn không có quyền truy cập', status: false, data: [] });
    const checkRole = await connectSchema__User.findOne({ _id: decoded._id }).select('role');
    if (!checkRole || checkRole.role !== 'Admin') return res.status(401).json({ message_en: 'You do not have access.', message_vn: 'Bạn không có quyền truy cập', status: false, data: [] });


    try {
        const filter = status === 'NAV' ? {} : { status };
        const result = await connectSchema
            .find(filter)
            .select('name price img advertisement remainingQuantity sold status')
            .limit(50);

        if (result.length === 0) return res.status(201).json({ mesage_vn: 'Không tìm thấy dữ liệu', mesage_en: 'Query failed', data: [], status: false });
        return res.status(200).json({ mesage_vn: 'Truy vấn thành công', mesage_en: 'Query successful', data: result, status: false });
    } catch (error) {
        if (error) return next(error);
    }
}


// Quản trị chi tiết sản phẩm
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
            .limit(100);
        if (result.length === 0) return res.status(201).json({ mesage_vn: 'Không tìm thấy dữ liệu', mesage_en: 'Query failed', data: [], status: false });
        return res.status(200).json({ mesage_vn: 'Truy vấn thành công', mesage_en: 'Query successful', data: result, status: true });
    } catch (error) {
        if (error) return next(error);
    }
}


// Danh sách sản phẩm SALE
const Admin_SelectProductSale = async (req, res, next) => {
    const { statusSale } = req.query;
    const idUser = req.params.idUser;
    if (!mongoose.Types.ObjectId.isValid(idUser)) return res.status(404).json({ error: 'Invalid _id', Status: false, data: [] });

    // Check Token
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = auth.verifyAccessToken(token);
    if (idUser !== decoded._id) return res.status(401).json({ message_en: 'You do not have access.', message_vn: 'Bạn không có quyền truy cập', status: false, data: [] });
    const checkRole = await connectSchema__User.findOne({ _id: decoded._id }).select('role');
    if (!checkRole || checkRole.role !== 'Admin') return res.status(401).json({ message_en: 'You do not have access.', message_vn: 'Bạn không có quyền truy cập', status: false, data: [] });


    try {
        if (statusSale === 'SALE') {
            const result = await connectSchema
                .find({
                    status: true,
                    priceSale: { $gt: 1 }
                })
                .select('name price img priceSale remainingQuantity sold')
                .limit(10);

            if (result.length === 0) return res.status(201).json({ mesage_vn: 'Không tìm thấy dữ liệu', mesage_en: 'Query failed', data: [], status: false });
            return res.status(200).json({ mesage_vn: 'Truy vấn thành công nhé bạn', mesage_en: 'Query successful', data: result, status: false });
        }

        else {
            const result = await connectSchema
                .find({
                    status: true,
                    priceSale: 0
                })
                .select('name price img priceSale remainingQuantity sold')
                .limit(10);

            if (result.length === 0) return res.status(201).json({ mesage_vn: 'Không tìm thấy dữ liệu', mesage_en: 'Query failed', data: [], status: false });
            return res.status(200).json({ mesage_vn: 'Truy vấn thành công nhé bạn', mesage_en: 'Query successful', data: result, status: false });
        }

    } catch (error) {
        if (error) return next(error);
    }
}

const Admin_SelectProductAdvertisement = async (req, res, next) => {
    const { statusAdvertisement } = req.query;
    const idUser = req.params.idUser;
    if (!mongoose.Types.ObjectId.isValid(idUser)) return res.status(404).json({ error: 'Invalid _id', Status: false, data: [] });
    const isAdvertisement = statusAdvertisement === 'true' ? true : false;


    // Check Token
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = auth.verifyAccessToken(token);
    if (idUser !== decoded._id) return res.status(401).json({ message_en: 'You do not have access.', message_vn: 'Bạn không có quyền truy cập', status: false, data: [] });
    const checkRole = await connectSchema__User.findOne({ _id: decoded._id }).select('role');
    if (!checkRole || checkRole.role !== 'Admin') return res.status(401).json({ message_en: 'You do not have access.', message_vn: 'Bạn không có quyền truy cập', status: false, data: [] });


    try {
        const result = await connectSchema
            .find({
                status: true,
                advertisement: isAdvertisement  // Sửa lỗi cú pháp so sánh ở đây
            })
            .select('name price img priceSale remainingQuantity sold advertisement')
            .limit(10);

        if (result.length === 0) return res.status(201).json({ mesage_vn: 'Không tìm thấy dữ liệu', mesage_en: 'Query failed', data: [], status: false });
        return res.status(200).json({ mesage_vn: 'Truy vấn thành công nhé bạn', mesage_en: 'Query successful', data: result, status: false });
    } catch (error) {
        if (error) return next(error);
    }
}



const Admin_transitionAdvertisement = async (req, res, next) => {
    const _id = req.params.id;
    const idUser = req.params.idUser;
    if (!mongoose.Types.ObjectId.isValid(_id || idUser)) return res.status(404).json({ mesage_vn: 'Lỗi truy vấn', mesage_en: 'Erro query', Status: false });
    const { status } = req.query;

    // Check Token
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = auth.verifyAccessToken(token);
    if (idUser !== decoded._id) return res.status(401).json({ message_en: 'You do not have access.', message_vn: 'Bạn không có quyền truy cập', status: false, data: [] });
    const checkRole = await connectSchema__User.findOne({ _id: decoded._id }).select('role');
    if (!checkRole || checkRole.role !== 'Admin') return res.status(401).json({ message_en: 'You do not have access.', message_vn: 'Bạn không có quyền truy cập', status: false, data: [] });


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


const Admin_EditProduct = async (req, res, next) => {
    const { id } = req.params;
    const idUser = req.params.idUser;
    if (!mongoose.Types.ObjectId.isValid(id || idUser)) return res.status(404).json({ mesage_vn: 'Lỗi truy vấn', mesage_en: 'Erro query', Status: false });

    // Check Token
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = auth.verifyAccessToken(token);
    if (idUser !== decoded._id) return res.status(401).json({ message_en: 'You do not have access.', message_vn: 'Bạn không có quyền truy cập', status: false, data: [] });
    const checkRole = await connectSchema__User.findOne({ _id: decoded._id }).select('role');
    if (!checkRole || checkRole.role !== 'Admin') return res.status(401).json({ message_en: 'You do not have access.', message_vn: 'Bạn không có quyền truy cập', status: false, data: [] });


    try {
        const { name, price, describe, remainingQuantity, present, priceSale } = req.body;
        const dataEdit = { name, price, describe, remainingQuantity, present, priceSale }
        const result = await connectSchema.findByIdAndUpdate(
            id,
            { $set: dataEdit },
            {
                new: true,
                runValidators: true
            }
        );

        if (!result) return res.status(400).json({ mesage_vn: 'Cập nhật thất bại', mesage_en: 'Update failed', status: false });
        return res.status(200).json({ mesage_vn: 'Cập nhật thành công', mesage_en: 'Update successful', status: true });

    } catch (error) {
        if (error) return next(error);
    }
};


const getAllProduct = async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    try {
        const result = await connectSchema
            .find({ status: true })
            .select('name price priceSale img remainingQuantity sold')
            .sort({ _id: -1 })
            .skip(skip)
            .limit(limit);

        const totalItems = await connectSchema.countDocuments();
        const totalPages = Math.ceil(totalItems / limit);

        if (result.length === 0) return res.status(201).json({ mesage_vn: 'Không tìm thấy dữ liệu', mesage_en: 'Query failed', data: [], status: false });
        return res.status(200).json({
            mesage_vn: 'Truy vấn thành công', mesage_en: 'Query successful',
            data: result, pagination: { totalItems, totalPages, currentPage: page },
            status: false
        });
    } catch (error) {
        if (error) return next(error);
    }
}




// Cline
router.get("/view-all", getAllProduct); // danh sách tất cả sản phẩm
router.get("/view-product-phone", getProduct_Phone); // dánh sách sản phẩm điện thoại
router.get("/view-product-loudspeaker", getProduct_Loudspeaker); // dánh sách sản phẩm loa


router.get("/view-product-accessory", getProduct_Accessory); // danh sách sản phẩm phụ kiện
router.get("/view-Trademark-Product/:id", TrademarkPrduct); // danh sách sản phẩm loa
router.get("/view-sale", salePrice); // danh sách sản phẩm SALE 

//
router.get("/viewDetail/:id", getProductDetail); // chi tiết sản phẩm
router.get("/search-Product", searchProduct); // tìm kiếm sản phẩm
router.get("/view-advertisement", advertisement); // slide quảng cáo


// Admin
router.post("/add/:idUser", addProductLogic); // Thêm mới sản phẩm
router.put("/admin-Product-Edit/:id/:idUser", Admin_EditProduct);

router.get("/admin-SelectAll/:idUser", Admin_SelectProduct); // tất cả sản phẩm 
router.get("/admin-Select-ProductSale&No-Sale/:idUser", Admin_SelectProductSale); // DSach SP SALE và Không Sale ĐK SALE & NO
// router.get("/admin-Number-Of-Product-Sales/:idUser", Admin_NumberOfProductSales)
router.get("/admin-Detail/:id/:idUser", Admin__DetailProduct); // chi tiết sản phẩm
router.get("/admin-Select-ProductSale&No-Sale/:idUser", Admin_SelectProductSale); // DSach SP SALE và Không Sale ĐK SALE & NO

// Quảng cáo
router.get("/admin-Select-ProductAdvertisement/:idUser", Admin_SelectProductAdvertisement);
router.put("/admin-state-Transition-ProductAdvertisement/:id/:idUser", Admin_transitionAdvertisement);
router.put("/state-Transition/:id", stateTransition);
module.exports = router;