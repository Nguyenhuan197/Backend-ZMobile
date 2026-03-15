const mongoose = require("mongoose");


const recruitmentSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        sex: { type: String, required: true },
        age: { type: Number, required: true },
        city: { type: String, required: true },
        phone: { type: Number, required: true },
        status: { type: Boolean, required: true, default: false }
    },

    { collection: "Recruitment" }
);

module.exports = mongoose.model("Recruitment", recruitmentSchema);