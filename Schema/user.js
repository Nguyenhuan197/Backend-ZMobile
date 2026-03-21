
const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, default: 'Chưa cập nhật' },
        email: { type: String, required: true },
        password: { type: String, required: true, default: 'NAV - Google' },
        phone: { type: String, required: true, default: 'Chưa cập nhật' },
        image: { type: String, required: true, default: 'imageDefault.png' },
        status: { type: Boolean, required: true, default: true },
        deliveryAddress: { type: String, required: true, default: 'Chưa cập nhật' },
        role: { type: String, required: true, default: 'Client' },
        googleId: { type: String, default: 'NAV Google' },
        date: { type: Date, default: Date.now }
    },
    {
        collection: "Users",
        timestamps: true
    }
);

module.exports = mongoose.model("Users", usersSchema);