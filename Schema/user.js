const mongoose = require("mongoose");
const usersSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, default: 'Chưa cập nhật' },
        email: { type: String, required: true },
        password: { type: String, required: true },
        phone: { type: String, required: true, default: 'Chưa cập nhật' },
        image: { type: String, required: true, default: 'imageDefault.png' },
        status: { type: Boolean, require: true, default: true },
        deliveryAddress: { typeof: String, require: true, default: 'Chưa cập nhật' },
        role: { type: String, require: true, default: 'Cline' }
    },
    { collection: "Users" },
    { timestamps: true }
);

module.exports = mongoose.model("Users", usersSchema);








