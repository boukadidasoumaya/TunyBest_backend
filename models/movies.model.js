const connection = require("../db");
require("dotenv").config();


exports.getAllMovies = () => {  
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM movies`, (err, result) => {
      if (err) {
        reject('erreeuurr');
      } else {
        resolve(result);
      }
    });
  });
}

exports.getOneMovie = (id) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM movies WHERE id = ?`,
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
}

exports.createMovie = (obj) => {
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
  } = obj;
  return new Promise((resolve, reject) => {
    connection.query(
      `INSERT INTO movies(title,bigimage,littleimage,description,rating,year, trailer,country,language,creator,runningtime) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      [title, bigimage,littleimage, description, rating, year, trailer,country,language,creator,runningtime],
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

exports.updateMovie = (id, obj) => {

  return new Promise((resolve, reject) => {
    connection.query(
      `UPDATE movies SET ? WHERE id = ?`,
      [obj, id],
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
exports.deleteMovie = (id) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `DELETE FROM movies WHERE id = ?`,
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
}

exports.searchMovie = (search) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM movies WHERE title LIKE '%${search}%'`,
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

