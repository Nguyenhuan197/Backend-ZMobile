

const jwt = require('jsonwebtoken');

class CheckToken {
    verifyAccessToken(token) {
        if (!token) {
            throw new Error('Token không tồn tại');
        }

        return jwt.verify(
            token,
            process.env.SECRETKEY
        );
    }
}

module.exports = CheckToken;
