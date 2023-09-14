const categoryModel = require('../models/category.model');
const route = require('express').Router();

route.get('/all', (req, res) => {
    categoryModel.getAllCategories()
        .then((results) => {
            res.status(200).json(results);
        }).catch((err) => {
        console.log(err);
    });
});
route.get('/:id/:media', (req, res) => {
    const {id,media} = req.params;
    categoryModel.getCategoriesByMedia(id,media)
        .then((results) => {
            res.status(200).json(results);
        }).catch((err) => {
        console.log(err);
    });
});

route.get('/similar/:media/:id', (req, res) => {
    const {id,media} = req.params;
    categoryModel.getSimilarMedia(id,media)
        .then((results) => {
            res.status(200).json(results);
        }).catch((err) => {
        console.log(err);
    })
})
module.exports = route;