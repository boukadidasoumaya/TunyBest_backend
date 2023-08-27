const jwt = require("jsonwebtoken");
require('dotenv').config();

let privateKey = process.env.PRIVATE_KEY;
let refreshPrivateKey = process.env.REFRESH_PRIVATE_KEY;

exports.verifyToken = (req, res, next) => {
    let token = req.headers["authorization"];
    // let token = req.cookies.refreshToken;
    if (!token) {
        return res.status(403).json({msg: "No token provided!"});
    }
    token = token.split(" ")[1];
    jwt.verify(token, privateKey, (err, decoded) => {
        if (err) {
            res.status(401).json({err, msg: "Unauthorized!"});

        }
        req.tokenData = decoded;
        next();
    });
}

exports.verifyRefreshToken = (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    console.log("refresh", req.cookies);
    if (!refreshToken) {
        return res.status(403).json({msg: "No refresh token provided!"});
    }
    // verify if it s the same refresh token
    jwt.verify(refreshToken, refreshPrivateKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({err, msg: "Unauthorized!!!"});
        }
        req.refreshTokenData = decoded;
        next();
    });
};

exports.generateAccessToken = (user) => {
    return jwt.sign({
        email: user.email,
        userId: user.id
    }, privateKey, {
        expiresIn: '30s'
    });
}