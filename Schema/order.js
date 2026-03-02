const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
    {
        id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
        shippingInfo: {
            recipientName: { type: String, required: true },
            phone: { type: String, required: true },
            address: { type: String, required: true },
            email: { type: String }
        },

        paymentMethod: {
            type: String,
            enum: ['COD', 'QR Code'],
            default: 'COD'
        },

        totalPrice: { type: Number, required: true }, // Tổng tiền cuối cùng (đã cộng ship)
        shippingFee: { type: Number, default: 0 },

        statusOrder: {
            type: String,
            required: true,
            enum: ['Awaiting confirmation', 'Processing', 'Shipping', 'Delivered', 'Cancelled'],
            default: 'Awaiting confirmation'
        },

        dateOfPurchase: { type: Date, default: Date.now }
    },
    { collection: "Order", timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);