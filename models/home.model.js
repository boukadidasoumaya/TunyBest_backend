const connection = require("../db");
require("dotenv").config();

exports.getAllRandomMedia = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM (
      SELECT 'movie' AS type, title, bigimage, littleimage, description, rating, year, trailer, country, language, creator, runningtime
      FROM movies
      ORDER BY rating DESC
      LIMIT 5
  ) AS top_movies
  UNION ALL
  SELECT * FROM (
      SELECT 'series' AS type, title, bigimage, littleimage, description, rating, year, trailer, country, language, creator, runningtime
      FROM series
      ORDER BY rating DESC
      LIMIT 5
  ) AS top_series
  ORDER BY RAND();
  `,
      (err, result) => {
        if (err) {
          reject("erreerr");
        } else {
          resolve(result);
        }
      }
    );
  });
};
