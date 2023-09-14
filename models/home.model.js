const connection = require("../db");
require("dotenv").config();




function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}



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
exports.getAllRandomMediaTrending = async () => {
  try {
    const [moviesResult, seriesResult] = await Promise.all([
      new Promise((resolve, reject) => {
        connection.query(
          `
          SELECT id, 'movie' AS type, title, bigimage, littleimage, rating, year, runningtime, releasedate
          FROM movies
          ORDER BY rating DESC, releasedate DESC
          LIMIT 10;
          `,
          (err, result) => {
            if (err) {
              reject("erreerr");
            } else {
              resolve(result);
            }
          }
        );
      }),
      new Promise((resolve, reject) => {
        connection.query(
          `
          SELECT id, 'series' AS type, title, bigimage, littleimage, rating, year, nbseason, releasedate
          FROM series
          ORDER BY rating DESC, releasedate DESC 
          LIMIT 10;
          `,
          (err, result) => {
            if (err) {
              reject("erreerr");
            } else {
              resolve(result);
            }
          }
        );
      })
    ]);

    const combinedResults = [...moviesResult, ...seriesResult];

    const shuffledResults = shuffleArray(combinedResults);

    const results = await Promise.all(shuffledResults.map(async (row) => {
      const mediaType = row.type;
      const mediaId = row.id; 
      const mediaCategories = await this.getCategoriesByMedia(mediaId, mediaType);
      console.log("inside trending");
      console.log(mediaCategories);
      return {
        ...row,
        categories: mediaCategories
      };
    }));

    return results;
  } catch (error) {
    throw error;
  }
};


exports.getAllRandomMediaPopular = async () => {
  try {
    const [moviesResult, seriesResult] = await Promise.all([
      new Promise((resolve, reject) => {
        connection.query(
          `
          SELECT id, 'movie' AS type, title, bigimage, littleimage, description, rating, year, trailer, country, language, creator, runningtime
          FROM movies
          ORDER BY rating DESC
          LIMIT 10;
          `,
          (err, result) => {
            if (err) {
              reject("erreerr");
            } else {
              resolve(result);
            }
          }
        );
      }),
      new Promise((resolve, reject) => {
        connection.query(
          `
          SELECT id, 'series' AS type, title, bigimage, littleimage, description, rating, year, nbseason, trailer, country, language, creator, runningtime
          FROM series
          ORDER BY rating DESC
          LIMIT 10;
          `,
          (err, result) => {
            if (err) {
              reject("erreerr");
            } else {
              resolve(result);
            }
          }
        );
      })
    ]);

    const combinedResults = [...moviesResult, ...seriesResult];
    const shuffledResults = shuffleArray(combinedResults);

    const results = await Promise.all(shuffledResults.map(async (row) => {
      const mediaType = row.type;
      const mediaId = row.id;
      const mediaCategories = await this.getCategoriesByMedia(mediaId, mediaType);
      console.log("inside popular");
      console.log(mediaCategories);
      return {
        ...row,
        categories: mediaCategories
      };
    }));

    return results;
  } catch (error) {
    throw error;
  }
};

exports.getAllRandomMediaAnime = async () => {
  try {
    const [animeMovies, animeSeries] = await Promise.all([
      new Promise((resolve, reject) => {
        connection.query(
          `
          SELECT id, 'movie' AS type, title, bigimage, littleimage, rating, year, runningtime, releasedate
          FROM movies
          WHERE id IN (
            SELECT movie_id FROM categories WHERE category_id = (
              SELECT id FROM categoryname WHERE name = 'anime'
            )
          )
          ORDER BY RAND()
          LIMIT 10;
          `,
          (err, result) => {
            if (err) {
              reject("erreerr");
            } else {
              resolve(result);
            }
          }
        );
      }),
      new Promise((resolve, reject) => {
        connection.query(
          `
          SELECT id, 'series' AS type, title, bigimage, littleimage, rating, year, nbseason, releasedate
          FROM series
          WHERE id IN (
            SELECT serie_id FROM categories WHERE category_id = (
              SELECT id FROM categoryname WHERE name = 'anime'
            )
          )
          ORDER BY RAND()
          LIMIT 10;
          `,
          (err, result) => {
            if (err) {
              reject("erreerr");
            } else {
              resolve(result);
            }
          }
        );
      })
    ]);

    const combinedResults = [...animeMovies, ...animeSeries];

    const shuffledResults = shuffleArray(combinedResults);

    const results = await Promise.all(shuffledResults.map(async (row) => {
      const mediaType = row.type;
      const mediaId = row.id; 
      const mediaCategories = await this.getCategoriesByMedia(mediaId, mediaType);
      console.log("inside anime");
      console.log(mediaCategories);
      return {
        ...row,
        categories: mediaCategories
      };
    }));

    return results;
  } catch (error) {
    throw error;
  }
};
exports.getAllRandomKDrama = async () => {
  try {
    const [KDramaMovies, KDramaSeries] = await Promise.all([
      new Promise((resolve, reject) => {
        connection.query(
          `
          SELECT id, 'movie' AS type, title, bigimage, littleimage, rating, year, runningtime, releasedate
          FROM movies
          WHERE id IN (
            SELECT movie_id FROM categories WHERE category_id = (
              SELECT id FROM categoryname WHERE name = 'K-Drama'
            )
          )
          ORDER BY RAND()
          LIMIT 10;
          `,
          (err, result) => {
            if (err) {
              reject("erreerr");
            } else {
              resolve(result);
            }
          }
        );
      }),
      new Promise((resolve, reject) => {
        connection.query(
          `
          SELECT id, 'series' AS type, title, bigimage, littleimage, rating, year, nbseason, releasedate
          FROM series
          WHERE id IN (
            SELECT serie_id FROM categories WHERE category_id = (
              SELECT id FROM categoryname WHERE name = 'K-Drama'
            )
          )
          ORDER BY RAND()
          LIMIT 10;
          `,
          (err, result) => {
            if (err) {
              reject("erreerr");
            } else {
              resolve(result);
            }
          }
        );
      })
    ]);

    const combinedResults = [...KDramaMovies, ...KDramaSeries];

    const shuffledResults = shuffleArray(combinedResults);

    const results = await Promise.all(shuffledResults.map(async (row) => {
      const mediaType = row.type;
      const mediaId = row.id; 
      const mediaCategories = await this.getCategoriesByMedia(mediaId, mediaType);
      console.log("inside anime");
      console.log(mediaCategories);
      return {
        ...row,
        categories: mediaCategories
      };
    }));

    return results;
  } catch (error) {
    throw error;
  }
};

exports.getAllNewMovies  = async () => {
  try {
    const [moviesResult] = await Promise.all([
      new Promise((resolve, reject) => {
        connection.query(
          `
          SELECT id, 'movie' AS type, title, bigimage, littleimage, description, rating, year, trailer, country, language, creator, runningtime
          FROM movies
          ORDER BY releasedate DESC
          LIMIT 10;
          `,
          (err, result) => {
            if (err) {
              reject("erreerr");
            } else {
              resolve(result);
            }
          }
        );
      }),
    ]);

  

    const results = await Promise.all(moviesResult.map(async (row) => {
      const mediaType = "movies";
      const mediaId = row.id;
      const mediaCategories = await this.getCategoriesByMedia(mediaId, mediaType);
      console.log(mediaCategories);
      return {
        ...row,
        categories: mediaCategories
      };
    }));

    return results;
  } catch (error) {
    throw error;
  }
};
exports.getAllNewSeries  = async () => {
  try {
    const [moviesResult] = await Promise.all([
      new Promise((resolve, reject) => {
        connection.query(
          `
          SELECT id, 'series' AS type, title, bigimage, littleimage, rating, year, nbseason, releasedate
          FROM series
          ORDER BY releasedate DESC
          LIMIT 10;
          `,
          (err, result) => {
            if (err) {
              reject("erreerr");
            } else {
              resolve(result);
            }
          }
        );
      }),
    ]);

  

    const results = await Promise.all(moviesResult.map(async (row) => {
      const mediaType = "series";
      const mediaId = row.id;
      const mediaCategories = await this.getCategoriesByMedia(mediaId, mediaType);
      console.log(mediaCategories);
      return {
        ...row,
        categories: mediaCategories
      };
    }));

    return results;
  } catch (error) {
    throw error;
  }
};


exports.getCategoriesByMedia = (mediaId, mediaType) => {
  const media_Id = mediaType === "movies" ? "movie_id" : "serie_id";
  return new Promise((resolve, reject) => {
      connection.query(`SELECT cn.name FROM categories c 
                     INNER JOIN categoryname cn 
                     on c.category_id = cn.id 
                     WHERE media_type = ? AND ${media_Id} = ?`,
                      [mediaType,mediaId], (err, result) => {
          if (err) {
              return({})
          } else {
              const categoryNames = result.map((row) => row.name);
              console.log("inside getcategories");
              console.log(result);
              console.log({categoryNames})
              resolve(categoryNames);
          }
      })
  })
}