const userModel = require("../models/user.model");
const route = require('express').Router();
const multer = require('multer');
const {verifyRefreshToken, generateAccessToken} = require("../utils/token.verification");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const upload = multer({storage: storage});

route.post('/register',upload.single('image'), (req, res) => {
        console.log(req.file);
        console.log(req.body);
        const {firstname, lastname, email, password, country, birthdate} = req.body;
        const image = req.file ? req.file.filename : '';
        userModel.register(
            firstname,
            lastname,
            email,
            password,
            image,
            country,
            birthdate
        ).then((results) => {
            res.status(201).json({results, msg: 'user added'});
        })
            .catch((err) => {
                if(err === 'Email already exists'){
                    res.status(409).json(err);
                } else if(err === "Internal Server Error") {
                    res.status(500).json(err);
                }else {
                    res.status(400).json(err);
                }
            });
    }
);

route.post('/login', (req, res) => {
    const {email, password} = req.body;
    userModel.login(email, password)
        .then((results) => {
            res.cookie('refreshToken', results.refreshToken,{
                httpOnly: true,
                secure: true,
                maxAge: 1000 * 60 * 60 * 24 * 7 * 4 // 1 month
            })
            res.status(200).json({token: results.token,refreshToken: results.refreshToken,user:results.user, msg: 'login success'});
        })
        .catch((err) => {
            if (err.code) {
                console.log(err);
                console.log(err.code);
                res.status(err.code).json(err.message);
            } else {
                res.status(500).json('Internal Server Error');
            }
        });
});

route.delete('/logout', (req, res) => {
    res.clearCookie('refreshToken');
    res.status(200).json({msg: 'logout success'});
});


route.post('/refresh', verifyRefreshToken, (req, res) => {
    const userId = req.refreshTokenData.userId;
    userModel.getUserById(userId)
        .then((results) => {
            const user = results[0];
            const token = generateAccessToken(user);
            const bearerToken = `Bearer ${token}`;
            res.status(200).json({
                token: bearerToken,
                msg: 'refresh success'
            });
        }).catch((err) => {
        console.log(err);
    });
});
module.exports = route;