const express = require("express");
const router = express.Router();
const { OAuth2Client } = require("google-auth-library");
const connectSchema = require("../Schema/user");
const connectToken = require('jsonwebtoken');
const secretKey = process.env.SECRETKEY; // Chữ ký
const expirationDateTocken = process.env.EXPIRESIN;


const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "postmessage"
);


router.post("/google-login", async (req, res) => {
    const { code } = req.body;
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    const ticket = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const resultCheck = await connectSchema
        .findOne({ googleId: payload.sub })
        .select('password role');

    if (!resultCheck) return res.status(201).json({ message_vn: 'Đăng nhập Google thất bại', message_en: 'Login Google failed', status: false });
    const dataToken = { _id: resultCheck._id }
    const token = connectToken.sign(dataToken, secretKey, { expiresIn: expirationDateTocken });
    res.status(201).json({ message_vn: 'Đăng nhập Google thành công !', message_en: 'Login Google successful !', token, status: true, role: resultCheck.role });
});



router.post("/google-register", async (req, res) => {
    try {
        const { code } = req.body;
        const { tokens } = await client.getToken(code);
        client.setCredentials(tokens);

        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
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