const mongoose = require("mongoose");
const trademarkSchema = new mongoose.Schema(
    {
        id_Category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
        name: { type: String, required: true },
        img: { type: String, required: true, default: 'NAV-IMG' },
        status: { type: Boolean, required: true, default: true }
    },

    { collection: "Trademark" }
);

module.exports = mongoose.model("Trademark", trademarkSchema);