const connection = require("../db");
const bcrypt = require("bcrypt");

exports.verifyOldPassword = (req, res, next) => {
  const { ActualPassword } = req.body;
  console.log(req.body);
  const id = req.body?.id;
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT password FROM user WHERE  id=?",
      [id],
      (err, result) => {
        if (err) {
          reject(err);
        }
        console.log(result[0]);
        if (result.length > 0) {
          bcrypt.compare(ActualPassword, result[0].password, (err, result) => {
            if (err) {
              console.log("wrong password");
              reject(err);
            }
            if (result) {
              console.log("succes");
              next();
            }
          });
        }
      }
    );
  });
};
