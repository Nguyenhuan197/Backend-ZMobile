const express = require("express");
const router = express.Router();
const { OAuth2Client } = require("google-auth-library");


// Thông tin lấy từ Google Cloud Console (Dùng file .env cho bảo mật)
const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "postmessage"
);


router.post("/google-login", async (req, res) => {
    try {
        const { code } = req.body; // Code nhận từ FE gửi lên

        // 1. Đổi code lấy Token
        const { tokens } = await client.getToken(code);
        client.setCredentials(tokens);

        // 2. Lấy thông tin người dùng từ Google
        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        console.log("Thông tin User từ Google:", payload);
        // 3. Logic của bạn: Kiểm tra user trong DB, tạo JWT token của riêng bạn...
        // const user = { email: payload.email, name: payload.name, avatar: payload.picture };

        res.status(200).json({
            status: true,
            message_vn: "Đăng nhập Google thành công",
            user: payload,
            token: "JWT_TOKEN_CỦA_BẠN_Ở_ĐÂY"
        });

    } catch (error) {
        console.error("Lỗi xác thực Google:", error);
        res.status(500).json({ status: false, message_vn: "Lỗi xác thực Google" });
    }
});

module.exports = router;