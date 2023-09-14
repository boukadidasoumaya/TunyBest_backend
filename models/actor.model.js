const connection = require('../db');


exports.getAllActors = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM actors', (err, results) => {
            if (err) {
                reject(err);
            }
            resolve(results);
        });
    });
}

exports.getActorByMedia = (mediaId, mediaType) => {
    const media_Id = mediaType === "movies" ? "movie_id" : "serie_id";
    return new Promise((resolve, reject) => {
        connection.query(`SELECT a.name,a.image,ar.role FROM actors a 
                       INNER JOIN actor_role ar 
                       on a.id = ar.actor_id 
                       WHERE media_type = ? AND ${media_Id} = ?`,
                        [mediaType,mediaId], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        })
    })
}