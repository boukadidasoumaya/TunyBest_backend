const route = require("express").Router();
const moviesModel = require("../models/movies.model");
route.get("/", (req, res) => {
  moviesModel
    .getAllMovies()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});
route.get("/:id", (req, res) => {
  const { id } = req.params;
  moviesModel
    .getOneMovie(id)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});
route.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  moviesModel
    .deleteMovie(id)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});
route.get("/create", (req, res) => {
  res.render("create");
});
route.post("/create", (req, res) => {
  const {
    title,
    bigimage,
    littleimage,
    description,
    rating,
    year,
    trailer,
    country,
    language,
    creator,
    runningtime,
  } = req.body;
  moviesModel
    .createMovie(req.body)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = route;
