const mongoose = require("mongoose");
const imageSchema = new mongoose.Schema({
    public_id: { type: String, required: true },
    secure_url: { type: String, required: true },
}, { _id: false });


const trademarkSchema = new mongoose.Schema(
    {
        id_Category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
        name: { type: String, required: true },
        img: imageSchema,
        status: { type: Boolean, required: true, default: true }
    },

    { collection: "Trademark" }
);

module.exports = mongoose.model("Trademark", trademarkSchema);