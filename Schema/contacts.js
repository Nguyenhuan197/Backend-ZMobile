const mongoose = require("mongoose");


const contactSchema = new mongoose.Schema(
    {
        idUser: { type: String, require: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: Number, required: true },
        content: { type: String, required: true },
        status: { type: Boolean, default: false }
    },

    { collection: "Contact" }
);

module.exports = mongoose.model("Contact", contactSchema);