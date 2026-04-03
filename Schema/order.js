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

        totalPrice: { type: Number, required: true },
        shippingFee: { type: Number, default: 0 },
        dateOfPurchase: { type: Date, default: Date.now }
    },
    { collection: "Order", timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);