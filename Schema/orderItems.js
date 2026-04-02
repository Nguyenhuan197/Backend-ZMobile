
const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema(
    {
        id_order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
        id_product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
        priceAtPurchase: { type: Number, required: true },
        variant: { type: String, default: '' },
        statusOrder: {
            type: String,
            required: true,
            enum: ['Awaiting confirmation', 'Processing', 'Shipping', 'Delivered', 'Cancelled'],
            default: 'Awaiting confirmation'
        },

        shippingCode: {
            type: String,
            unique: true,
            default: function () {
                const now = new Date();
                const year = now.getFullYear().toString().slice(-2);
                const month = (now.getMonth() + 1).toString().padStart(2, '0');
                const day = now.getDate().toString().padStart(2, '0');
                const randomNum = Math.floor(10000 + Math.random() * 90000);
                return `${year}${month}${day}${randomNum}`;
            }
        }
    },
    {
        collection: "OrderItem",
        timestamps: true
    }
);

module.exports = mongoose.model("OrderItem", OrderItemSchema);