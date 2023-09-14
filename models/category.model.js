const connection = require('../db');

exports.getAllCategories = () => {
return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM categoryname', (err, results) => {
            if (err) {
                reject(err);
            }
            resolve(results);
        });
    });
}

exports.getCategoriesByMedia = (mediaId, mediaType) => {
    const media_Id = mediaType === "movies" ? "movie_id" : "serie_id";
    return new Promise((resolve, reject) => {
        connection.query(`SELECT cn.name FROM categories c 
                       INNER JOIN categoryname cn 
                       on c.category_id = cn.id 
                       WHERE media_type = ? AND ${media_Id} = ?`,
                        [mediaType,mediaId], (err, result) => {
            if (err) {
                reject(err);
            } else {
                const categoryNames = result.map((row) => row.name);
                resolve(categoryNames);
            }
        })
    })
}

exports.getSimilarMedia = (mediaId, mediaType) => {
    const media_Id = mediaType === "movies" ? "movie_id" : "serie_id";

    return new Promise((resolve, reject) => {
        connection.query(`
            SELECT m.*
            FROM ${mediaType} m
            WHERE m.id != ? AND (
                SELECT COUNT(DISTINCT c1.category_id)
                FROM categories c1
                JOIN categories c2 ON c1.category_id = c2.category_id
                WHERE c1.${media_Id} = m.id AND c2.${media_Id} = ?
            ) >= 2
        `,
            [mediaId, mediaId],
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
    });
};









