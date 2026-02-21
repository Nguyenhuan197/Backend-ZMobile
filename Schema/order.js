


const mongoose = require("mongoose");
const Order = new mongoose.Schema(
    {
        id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
        id_product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        dateOfPurchase: {
            type: Date,
            default: Date.now
        },
        numberOrder: { type: Number, required: true, default: 1 },
        sumPrice: { type: Number, required: true },
        statusOrder: { type: String, required: true, default: 'Awaiting confirmation' }
    },

    { collection: "Order" }
);

module.exports = mongoose.model("Order", Order);
