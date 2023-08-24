const route = require('express').Router();
const userModel = require('../models/user.model');
const jwt = require("jsonwebtoken");
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const upload = multer({storage: storage});
    require('dotenv').config();

let privateKey = process.env.PRIVATE_KEY;

verifyToken = (req, res, next) => {
    let token = req.headers["authorization"];
    if (!token) {
        // return res.status(403).send({
        //     message: "No token provided!"
        // });
        return res.status(403).json({msg: "No token provided!"});
    }
    token = token.split(" ")[1];
    jwt.verify(token, privateKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({err, msg: "Unauthorized!"});
        }
        req.tokenData = decoded;
        next();
    });
}

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
            res.status(200).json({token: results.token,user:results.user, msg: 'login success'});
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


route.get('/', verifyToken, (req, res) => {
    userModel.getAllUsers()
        .then((results) => {
            res.json({userId: req.tokenData.userId, results});
        })
        .catch((err) => {
            console.log(err);
        });
});

route.get('/authUser', verifyToken, (req, res) => {
    const userId = req.tokenData.userId;
    userModel.getUserById(userId)
        .then((results) => {
            res.json(results);
        }).catch((err) => {
        console.log(err);
    });
})
module.exports = route;