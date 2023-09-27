const connection = require("../db");
const categoryModel = require("./category.model");
const userModel = require("./user.model");
const actorModel = require("./actor.model");
require("dotenv").config();

exports.getAllSeries = () => {
  return new Promise((resolve, reject) => {
    connection.query(`
      SELECT s.*, GROUP_CONCAT(cn.name) AS categoryNames, 'series' AS type
      FROM series AS s
      LEFT JOIN categories AS c ON s.id = c.serie_id
      LEFT JOIN categoryname AS cn ON c.category_id = cn.id
      GROUP BY s.id
      ORDER BY s.rating DESC, s.year DESC
    `, (err, result) => {
      if (err) {
        reject(err);
      } else {
        const seriesWithCategories = result.map(serie => ({
          ...serie,
          categories: serie.categoryNames ? serie.categoryNames.split(',') : []
        }));
        resolve(seriesWithCategories);
      }
    });
  });
};


exports.getSeasons = (serieId) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT season_number, nb_episodes FROM seasons WHERE serie_id = ? 
            AND season_number <= (SELECT nbseason FROM series WHERE id = ?)`,
                        [serieId,serieId], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
    })
}


exports.getOneSerie = async (id, userId) => {
    try {
        const result = await new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM series WHERE id = ?`, [id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        // Get categories
        result[0].categories = await categoryModel.getCategoriesByMedia(id, "series");

        // Get seasons
        result[0].seasons = await this.getSeasons(id);

        // Get actors
        result[0].actors = await actorModel.getActorByMedia(id, "series");

        // Check if it's in the user's list
        const results = await userModel.isFromMyList(userId, "series", id);

        if (results.length > 0) {
            result[0].isFromMyList = results[0];
        }

        return result[0];
    } catch (err) {
        throw err;
    }
};


exports.createSerie = (obj) => {
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
  } = obj;
  return new Promise((resolve, reject) => {
    connection.query(
      `INSERT INTO series(title,bigimage,littleimage,description,rating,year, trailer,country,language,creator,runningtime,nbseason) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
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
      ],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};
exports.updateSerie = (id, updatedData) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `UPDATE series SET ? WHERE id = ?`,
      [updatedData, id],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

exports.deleteSerie = (id) => {
  return new Promise((resolve, reject) => {
    connection.query(`DELETE FROM series WHERE id = ?`, [id], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

exports.searchSerie = (search) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM series WHERE title LIKE '%${search}%'`,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );  
  });
}


