
const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
    id_Room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
    name: { type: String, required: true },
    price: {
        type: Number, require: true,
        min: [0, "Giá không được nhỏ hơn 0"]
    }
}, { timestamps: true });


module.exports = mongoose.model("Product", productSchema);