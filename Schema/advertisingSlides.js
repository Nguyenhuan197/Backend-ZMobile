

const mongoose = require("mongoose");
const advertisingSlides = new mongoose.Schema(
    {
        name: { type: String, required: true },
        image: { type: String, required: true },
        status: { type: Boolean, require: true, default: true },
        price: { type: Number, required: true },
        priceSale: { type: Number, required: true },
        present: { type: String, required: true, default: '' }
    },
    { collection: "AdvertisingSlides" }
);

module.exports = mongoose.model("AdvertisingSlides", advertisingSlides);
