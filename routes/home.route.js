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
route.get("/trending", (req, res) => {
  homeModel
    .getAllRandomMediaTrending()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
}
);

route.get("/popular", (req, res) => {
  homeModel
    .getAllRandomMediaPopular()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
}
);
route.get("/anime", (req, res) => {
  homeModel
    .getAllRandomMediaAnime()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
}
);
route.get("/k-drama", (req, res) => {
  homeModel
    .getAllRandomKDrama()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
}
);
route.get("/newmovies", (req, res) => {
  homeModel
    .getAllNewMovies()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
}
);
route.get("/newseries", (req, res) => {
  homeModel
    .getAllNewSeries()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
}
);


module.exports = route;
