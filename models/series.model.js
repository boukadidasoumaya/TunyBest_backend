const connection = require("../db");
require("dotenv").config();

exports.getAllSeries = () => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM series`, (err, result) => {
      if (err) {
        reject("erreeurr");
      } else {
        resolve(result);
      }
    });
  });
};

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


