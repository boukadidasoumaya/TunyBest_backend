const connection = require('../db');

exports.handleRating = (rating, mediaId, mediaType, userId) => {
    const media_Id = mediaType === "movies" ? "movie_id" : "serie_id";
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ratings WHERE user_id = ? AND ${media_Id} = ?`,
            [userId, mediaId],
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    if (result.length === 0) {
                        exports.addRating(rating, mediaId, mediaType, userId)
                            .then((result) => {
                                resolve(result);
                            })
                            .catch((error) => {
                                reject(error);
                            });
                    } else {
                        exports.updateRating(rating, mediaId, mediaType, userId)
                            .then((result) => {
                                resolve(result);
                            })
                            .catch((error) => {
                                reject(error);
                            });
                    }
                }
            });
    });
}

exports.addRating = (rating, mediaId, mediaType, userId) => {
    const media_Id = mediaType === "movies" ? "movie_id" : "serie_id";
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO ratings (rating, ${media_Id}, user_id,media_type) VALUES (?, ?, ?, ?)`,
            [rating, mediaId, userId, mediaType],
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    exports.addRatingToMedia(mediaId, mediaType)
                        .then((rating) => {
                            resolve({result, rating: rating });
                        })
                        .catch((error) => {
                            reject(error);
                        });
                }
            });
    });
}

exports.updateRating = (rating, mediaId, mediaType, userId) => {
    const media_Id = mediaType === "movies" ? "movie_id" : "serie_id";
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE ratings SET rating = ? WHERE ${media_Id} = ? AND user_id = ? AND media_type = ?`,
            [rating, mediaId, userId, mediaType],
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    exports.addRatingToMedia(mediaId, mediaType)
                        .then((rating) => {
                            resolve({result, rating: rating });
                        })
                        .catch((error) => {
                            reject(error);
                        });
                }
            });
    });
}

exports.addRatingToMedia = (mediaId, mediaType) => {
    const media_Id = mediaType === "movies" ? "movie_id" : "serie_id";
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE ${mediaType} SET rating = (SELECT AVG(rating) FROM ratings WHERE ${media_Id} = ?) WHERE id = ?`,
            [mediaId, mediaId],
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    connection.query(
                        `SELECT rating FROM ${mediaType} WHERE id = ?`,
                        [mediaId],
                        (err, selectResult) => {
                            if (err) {
                                reject(err);
                            } else {
                                const newAverageRating =
                                    selectResult.length > 0 ? selectResult[0].rating : null;
                                resolve(newAverageRating);
                            }
                        }
                    );
                }
            });
    });
}

exports.getRatingPercentagesPerMedia = (mediaId, mediaType) => {
    const media_Id = mediaType === "movies" ? "movie_id" : "serie_id";
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT COUNT(*) as count, rating FROM ratings WHERE ${media_Id} = ? AND media_type = ? GROUP BY rating ORDER BY rating`,
            [mediaId, mediaType],
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    // Calculate percentages
                    const totalRatings = result.reduce((acc, row) => acc + row.count, 0);
                    const ratingPercentages = Array(10).fill(0);

                    result.forEach((row) => {
                        const rating = row.rating;
                        const count = row.count;
                        ratingPercentages[10 - rating] = ((count / totalRatings) * 100).toFixed(2);
                    });

                    resolve(ratingPercentages);
                }
            }
        );
    });
};
