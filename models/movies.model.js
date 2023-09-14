const connection = require("../db");
require("dotenv").config();
const getCategoriesByMedia=require("../models/home.model")

exports.getAllMovies = () => {
  return new Promise((resolve, reject) => {
    connection.query(`
      SELECT m.*, GROUP_CONCAT(cn.name) AS categoryNames
      FROM movies AS m
      LEFT JOIN categories AS c ON m.id = c.movie_id
      LEFT JOIN categoryname AS cn ON c.category_id = cn.id
      GROUP BY m.id
      ORDER BY m.rating DESC, m.year DESC
      LIMIT 10
    `, (err, result) => {
      if (err) {
        reject('erreeuurr');
      } else {
        const moviesWithCategories = result.map(movie => ({
          ...movie,
          categories: movie.categoryNames ? movie.categoryNames.split(',') : []
        }));
        resolve(moviesWithCategories);
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

