const mongoose = require("mongoose");


const OrderItemSchema = new mongoose.Schema(
    {
        id_order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
        id_product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },

        quantity: { type: Number, required: true, min: 1 },
        priceAtPurchase: { type: Number, required: true },

        // Có thể thêm thông tin biến thể nếu có (Ví dụ: Màu sắc, Dung lượng)
        variant: { type: String, default: '' }
    },
    { collection: "OrderItem" }
);

module.exports = mongoose.model("OrderItem", OrderItemSchema);