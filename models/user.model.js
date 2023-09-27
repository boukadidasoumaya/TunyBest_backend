const connection = require("../db");
const bcrypt = require("bcrypt");
const joi = require("joi");

const schemaValidation = joi.object({
  firstname: joi.string().min(2).max(30).alphanum().required().messages({
    "string.base": "firstname must be a string",
    "string.empty": "firstname is required",
    "string.min": "firstname must have at least {#limit} characters",
    "string.max": "firstname must have at most {#limit} characters",
    "any.required": "firstname is required",
    "string.alphanum": "firstname must only contain alphanumeric characters",
  }),
  lastname: joi.string().min(2).max(30).alphanum().required().messages({
    "string.base": "lastname must be a string",
    "string.empty": "lastname is required",
    "string.min": "lastname must have at least {#limit} characters",
    "string.max": "lastname must have at most {#limit} characters",
    "any.required": "lastname is required",
    "string.alphanum": "lastname must only contain alphanumeric characters",
  }),
});
const emailValidation = joi.object({
  email: joi.string().email().required().messages({
    "string.base": "email must be a valid email address",
    "string.empty": "email is required",
    "string.email": "email must be a valid email address",
    "any.required": "email is required",
  }),
});
const passwordValidation = joi.object({
  password: joi.string().min(6).max(30).required().messages({
    "string.base": "password must be a string",
    "string.empty": "password is required",
    "string.min": "password must have at least {#limit} characters",
    "string.max": "password must have at most {#limit} characters",
    "any.required": "password is required",
  }),
});

exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM user WHERE id = ?",
      [id],
      (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      }
    );
  });
};

exports.updateUser = (id, updatedData, image) => {
  const { firstname, lastname, country, birthdate, role } = updatedData;
  return new Promise(async (resolve, reject) => {
    try {
      const validation = await schemaValidation.validateAsync(
        {
          firstname,
          lastname,
        },
        { abortEarly: false }
      );
      if (validation.error) {
        const errorMessages = validation.error.details.map(
          (err) => err.message
        );
        reject(errorMessages);
        return;
      }
      connection.query(
        `UPDATE user SET firstname=?,lastname=?,image=?,country=?,birthdate=?,role=? WHERE id = ?`,
        [firstname, lastname, image, country, birthdate, role, id],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};
exports.updateEmail = (id, email) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM user WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) {
          reject("Internal Server Error");
          return;
        }
        if (results.length > 0) {
          reject("Email already exists");
          return;
        }
        try {
          const validation = await emailValidation.validateAsync(
            {
              email,
            },
            { abortEarly: false }
          );
          if (validation.error) {
            reject(validation.error);
            return;
          }
          connection.query(
            `UPDATE user SET email=? WHERE id=? `,
            [email, id],
            (err, results) => {
              if (err) {
                reject("Internal Server Error");
              }
              resolve(results);
            }
          );
        } catch (error) {
          reject(error.details);
        }
      }
    );
  });
};

exports.updatePasswordUser = (id, ActualPassword, password) => {
  return new Promise(async (resolve, reject) => {
    const hash = await bcrypt.hash(password, 10);
    const validation = await passwordValidation.validateAsync(
      {
        password,
      },
      { abortEarly: false }
    );
    if (validation.error) {
      // const errorMessages = validation.error.details.map((err) => err.message);
      reject(validation.error);

      return;
    }
    connection.query(
      `UPDATE user SET password=? WHERE id = ?`,
      [hash, id],
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
exports.getMyListUser = (id) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT
  ml.id,
  ml.media_type as type,
  CASE
    WHEN ml.media_type = 'movies' THEN m.title
    ELSE s.title
  END AS title,
  CASE
    WHEN ml.media_type = 'movies' THEN m.littleimage
    ELSE s.littleimage
  END AS littleimage,
  CASE
    WHEN ml.media_type = 'movies' THEN m.id
    ELSE s.id
  END AS media_id
FROM mylist ml
LEFT JOIN movies m ON ml.movie_id = m.id
LEFT JOIN series s ON ml.serie_id = s.id
WHERE ml.user_id = ? 
AND ml.deleted_at IS NULL;
`,
      [id],
      (err, results) => {
        if (err) {
          console.log("errue inside get")
          reject(err);
        }
        resolve(results);
      }
    );
  });
};

exports.addToMyListUser = (userId, mediaType, mediaId) => {
    console.log("inside add to list", mediaType)
    const media_id = mediaType === "movies" ? "movie_id" : "serie_id";
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO mylist (user_id, media_type, ${media_id}) VALUES (?, ?, ?)`, [userId, mediaType, mediaId], (err, results) => {
            if (err) {
                reject(err);
            }
            connection.query(`SELECT * FROM mylist WHERE id = ?`, [results.insertId], (err, results) => {
                if (err) {
                    reject(err);
                }
                resolve(results[0]);
            })
        })
    })
};

exports.deleteFromMyListUser = (id) => {
    const date = new Date();
    return new Promise ((resolve, reject) => {
        connection.query(`UPDATE mylist set deleted_at = ? WHERE id = ?`, [date, id], (err, results) => {
            if (err) {
                reject(err);
            }
            resolve(results);
        })
    })
}

exports.isFromMyList = (userId, mediaType, mediaId) => {
    const media_id = mediaType === "movies" ? "movie_id" : "serie_id";
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM mylist WHERE user_id = ? AND media_type = ? AND ${media_id} = ? AND deleted_at is NULL  `, [userId, mediaType, mediaId], (err, results) => {
            if (err) {
                reject(err);
            }
            resolve(results);
        })
    })
}
