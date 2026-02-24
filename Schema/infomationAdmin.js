

const mongoose = require("mongoose");
const InfomationAdminSchema = new mongoose.Schema(
    {
        nameLogo: { type: String, required: true },
        contact: { type: String, required: true },
        phone: { type: String, required: true },
        nameAdmin: { type: String, required: true },
        address: { type: String, required: true },
        email: { type: String, required: true },
        slogan: { type: String, required: true },
        pageFB: { type: String, required: true },
        ticktock: { type: String, required: true },
        shopee: { type: String, required: true },
        workingHours: { type: String, required: true },
        view: { type: Number, default: 1 },
    },

    { collection: "InfomationAdmin" }
);

module.exports = mongoose.model("InfomationAdmin", InfomationAdminSchema);