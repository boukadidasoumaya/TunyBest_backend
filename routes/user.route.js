const route = require('express').Router();
const userModel = require('../models/user.model');
const jwt = require("jsonwebtoken");
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




route.get('/', verifyToken, (req, res) => {
    userModel.getAllUsers()
        .then((results) => {
            res.json({userId: req.tokenData.userId, results});
        })
        .catch((err) => {
            console.log(err);
        });
});

route.post('/register', (req, res) => {
        const {firstname, lastname, email, password, image, country, birthdate} = req.body;
        userModel.register(
            firstname,
            lastname,
            email,
            password,
            image,
            country,
            birthdate
        ).then((results) => {
            res.status(200).json({results, msg: 'user added'});
        })
            .catch((err) => {
                res.status(400).json(err);
            });
    }
);

route.post('/login', (req, res) => {
    const {email, password} = req.body;
    userModel.login(email, password)
        .then((results) => {
            res.status(200).json({results, msg: 'login success'});
        })
        .catch((err) => {
            res.status(400).json(err);
        });
});


module.exports = route;