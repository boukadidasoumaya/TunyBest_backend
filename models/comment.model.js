const connection = require("../db.js");

exports.getAllCommentsAndRepliesByMediaName = (mediaId, mediaType) => {
    const media_Id = mediaType === "movies" ? "movie_id" : "serie_id";
    return new Promise((resolve, reject) => {
        const query = `
            SELECT
                c.id,
                c.text,
                u.id AS user_id,
                u.firstname,
                u.lastname,
                u.image,
                c.parent_id,
                c.media_type,
                c.serie_id,
                c.movie_id,
                c.created_at
            FROM comments AS c
            INNER JOIN user AS u ON c.user_id = u.id
            WHERE c.${media_Id} = ? AND deleted_at IS NULL
            ORDER BY c.id;
        `;

        connection.query(query, [mediaId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                const commentMap = new Map();
                const topLevelComments = [];

                results.forEach(row => {
                    if (row.parent_id === null) {
                        const comment = {
                            id: row.id,
                            text: row.text,
                            user_id: row.user_id,
                            username: row.firstname + " " + row.lastname,
                            user_image: row.image,
                            created_at: row.created_at,
                            replies: []
                        };
                        commentMap.set(row.id, comment);
                        topLevelComments.push(comment);
                    } else {
                        const parentComment = commentMap.get(row.parent_id);
                        if (parentComment) {
                            const reply = {
                                id: row.id,
                                text: row.text,
                                user_id: row.user_id,
                                username: row.firstname + " " + row.lastname,
                                user_image: row.image,
                                created_at: row.created_at,
                                replies: []
                            };
                            parentComment.replies.push(reply);
                            commentMap.set(row.id, reply);
                        }
                    }
                });

                resolve(topLevelComments);
            }
        });
    });
}

exports.addComment = (text,user_id,parent_id,media_type,media_id,created_at) => {
    const media_Id = media_type === "movies" ? "movie_id" : "serie_id";
    return new Promise((resolve,reject) => {
        connection.query(`INSERT INTO comments (text,user_id,parent_id,media_type,${media_Id},created_at) 
                        VALUES (?,?,?,?,?,?)`,
            [text,user_id,parent_id,media_type,media_id,created_at], (err, results) => {
                if (err) {
                    reject(err);
                }
                resolve(results);
            })
    })
}

const updateCommentAndReplies = async (id, delete_at) => {
    // Update the comment
    await new Promise((resolve, reject) => {
        connection.query(`UPDATE comments SET deleted_at = ? WHERE id = ?`, [delete_at, id], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });

    // Fetch nested replies
    const nestedResults = await new Promise((resolve, reject) => {
        connection.query(`SELECT id FROM comments WHERE parent_id = ? AND deleted_at IS NULL`, [id], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });

    // Recursively update nested replies
    for (const nestedRow of nestedResults) {
        await updateCommentAndReplies(nestedRow.id, delete_at);
    }
};

exports.deleteComment = async (id) => {
    const delete_at = new Date();
    try {
        await updateCommentAndReplies(id, delete_at);
        return { success: true };
    } catch (err) {
        throw err;
    }
};

exports.handleLike = async (commentId, userId) => {
    try {
        const like = await exports.getLikeByUserId(commentId, userId);
        if (like.length === 0) {
            await exports.likeComment(commentId, userId);
            return { success: true };
        } else {
            await exports.unlikeComment(commentId, userId);
            return { success: false };
        }
    } catch (err) {
        throw err;
    }
}

exports.likeComment = (commentId, userId) => {
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO likes (comment_id, user_id) VALUES (?, ?)`, [commentId, userId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

exports.unlikeComment = (commentId, userId) => {
    return new Promise((resolve, reject) => {
        connection.query(`DELETE FROM likes WHERE comment_id = ? AND user_id = ?`, [commentId, userId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

exports.getLikesByCommentId = (commentId) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM likes WHERE comment_id = ?`, [commentId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

exports.getLikeByUserId = (commentId,userId) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM likes WHERE comment_id = ? AND user_id = ?`, [commentId,userId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}
