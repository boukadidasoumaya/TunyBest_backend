const route = require("express").Router();
const homeModel = require("../models/home.model");

route.get("/", (req, res) => {
  homeModel
    .getAllRandomMedia()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
}
);

module.exports = route;
