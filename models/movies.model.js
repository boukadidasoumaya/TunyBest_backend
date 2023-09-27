const connection = require("../db");
const categoryModel = require("./category.model");
const actorModel = require("./actor.model");
require("dotenv").config();
const getCategoriesByMedia=require("../models/home.model")
const userModel = require("./user.model");

exports.getAllMovies = () => {
  return new Promise((resolve, reject) => {
    connection.query(`
      SELECT m.*, GROUP_CONCAT(cn.name) AS categoryNames, 'movies' AS type
      FROM movies AS m
      LEFT JOIN categories AS c ON m.id = c.movie_id
      LEFT JOIN categoryname AS cn ON c.category_id = cn.id
      GROUP BY m.id
      ORDER BY m.rating DESC, m.year DESC
    `, (err, result) => {
      if (err) {
        reject(err);
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


exports.getOneMovie = async (id, userId) => {
    try {
        const result = await new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM movies WHERE id = ?`, [id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        // Get categories
        result[0].categories = await categoryModel.getCategoriesByMedia(id, "movies");

        // Get actors
        result[0].actors = await actorModel.getActorByMedia(id, "movies");

        // Check if it's in the user's list
        const results = await userModel.isFromMyList(userId, "movies", id);

        if (results.length > 0) {
            result[0].isFromMyList = results[0];
        }

        return result[0];
    } catch (err) {
        throw err;
    }
};


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

