const route = require("express").Router();
const seriesModel = require("../models/series.model");
route.get("/", (req, res) => {
  seriesModel
    .getAllSeries()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

route.get("/:id/:userId", (req, res) => {
  const { id, userId } = req.params;

  seriesModel
    .getOneSerie(id,userId)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

route.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  seriesModel
    .deleteSerie(id)
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
    nbseason,
  } = req.body;

  seriesModel
    .createSerie(req.body)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log("err", err);
      res.status(500).json(err);
    });
});

route.post("/update/:id", (req, res) => {
  const { id } = req.params;
  seriesModel
    .updateSerie(id, req.body)
    .then((result) => {
      res.redirect("/series");
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = route;
