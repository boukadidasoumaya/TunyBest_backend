const route = require('express').Router();
const userModel = require('../models/user.model');
const {verifyToken, verifyRefreshToken} = require('../utils/token.verification');

route.get('/authUser', verifyRefreshToken, verifyToken, (req, res) => {
    const userId = req.tokenData.userId;
    userModel.getUserById(userId)
        .then((results) => {
            res.json(results);
        }).catch((err) => {
        console.log(err);
    });
})


module.exports = route;