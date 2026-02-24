
const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
    public_id: { type: String, required: true },
    secure_url: { type: String, required: true },
}, { _id: false });

const productSchema = new mongoose.Schema(
    {
        id_Trademark: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trademark",
            required: true
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        priceSale: { type: Number, required: true, default: 0 },
        describe: String,
        remainingQuantity: { type: Number, default: 0 },
        img: imageSchema,
        imgDetail: [imageSchema],
        status: { type: Boolean, default: true },
        view: { type: Number, default: 1, required: true },
        present: { type: String, require: true, default: 'Nav' },
        advertisement: { type: Boolean, require: true, default: false }

    },
    { collection: "Product" },
    { timestamps: true });

module.exports = mongoose.model("Product", productSchema);