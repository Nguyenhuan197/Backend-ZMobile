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

    },
    { collection: "OrderItem" }
);

module.exports = mongoose.model("OrderItem", OrderItemSchema);

