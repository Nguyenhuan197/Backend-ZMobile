const mongoose = require("mongoose");
const imageSchema = new mongoose.Schema({
    public_id: { type: String, required: true },
    secure_url: { type: String, required: true },
}, { _id: false });

const newsSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        img: imageSchema,
        describe: { type: String },
        view: { type: Number, default: 1 },
        status: { type: Boolean, required: true, default: true }
    },

    { collection: "News" }
);

module.exports = mongoose.model("News", newsSchema);