const ratingModel = require('../models/rating.model');
const route = require('express').Router();

route.post('/handleRating', (req, res) => {
    const {rating, mediaId, mediaType, userId} = req.body;
    ratingModel.handleRating(rating, mediaId, mediaType, userId)
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
        console.log(err);
    });
})

route.get('/getPercentages/:mediaId/:mediaType', (req, res) => {
    const {mediaId, mediaType} = req.params;
    ratingModel.getRatingPercentagesPerMedia(mediaId, mediaType)
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
        console.log(err);
    })
})
module.exports = route;