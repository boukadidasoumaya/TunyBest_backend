const connection = require('../db');


exports.getUserById = (id) => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM user WHERE id = ?',
            [id],
            (err, results) => {
                if (err) {
                    reject(err);
                }
                resolve(results);
            });
    });
}