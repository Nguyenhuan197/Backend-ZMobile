const express = require("express");
const router = express.Router();
const { OAuth2Client } = require("google-auth-library");
const connectSchema = require("../Schema/user");
const connectToken = require('jsonwebtoken');


// Thông tin lấy từ Google Cloud Console (Dùng file .env cho bảo mật)
const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "postmessage"
);



router.post("/google-login", async (req, res) => {
    try {
        const { code } = req.body;
        const { tokens } = await client.getToken(code);
        client.setCredentials(tokens);

        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        console.log("Google User:", payload);
        console.log('RUN ----');


        const newUser = new connectSchema({
            name: payload.name,
            email: payload.email,
            image: payload.picture,
            googleId: payload.sub,
        });

        const result = await newUser.save();
        if (!result) return res.status(400).json({ mesage_vn: 'Thêm tài khoản Google thất bại', mesage_en: 'More user Google failures', status: false });

        const dataToken = { _id: result._id }
        const token = connectToken.sign(dataToken, secretKey, { expiresIn: expirationDateTocken });
        return res.status(201).json({ message_vn: 'Thêm tài khoản Google thành công', message_en: 'More user Google success', status: true, token });


    } catch (error) {
        console.error("Google Login Error:", error);
        res.status(500).json({
            status: false,
            message_vn: "Lỗi xác thực Google"
        });
    }
});

module.exports = router;