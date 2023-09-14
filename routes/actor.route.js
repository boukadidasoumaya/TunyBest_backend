const actorModel = require('../models/actor.model');
const route = require('express').Router();


route.get('/all', (req, res) => {
    actorModel.getAllActors()
        .then((results) => {
            res.status(200).json(results);
        }).catch((err) => {
        console.log(err);
    });
})

module.exports = route;