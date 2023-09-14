const connection = require("../db");
require("dotenv").config();

exports.getAllSeries = () => {
  return new Promise((resolve, reject) => {
    connection.query(`
      SELECT s.*, GROUP_CONCAT(cn.name) AS categoryNames
      FROM series AS s
      LEFT JOIN categories AS c ON s.id = c.serie_id
      LEFT JOIN categoryname AS cn ON c.category_id = cn.id
      GROUP BY s.id
      ORDER BY s.rating DESC, s.year DESC
      LIMIT 10
    `, (err, result) => {
      if (err) {
        reject('erreeuurr');
      } else {
        const seriesWithCategories = result.map(serie => ({
          ...serie,
          categories: serie.categoryNames ? serie.categoryNames.split(',') : []
        }));
        resolve(seriesWithCategories);
      }
    });
  });
}


exports.getOneSerie = (id) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM series WHERE id = ?`,
      [id],
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


