const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const joi = require('joi');
const connection = require('../db');
require('dotenv').config();

let privateKey = process.env.PRIVATE_KEY;

const schemaValidation = joi.object({
    firstname: joi.string().min(2).max(30).alphanum().required(),
    lastname: joi.string().min(2).max(30).alphanum().required(),
    // email: joi.string().email({ maxDomainSegments: 2, tlds: {allow: ['com','net','tn','org', 'edu']} }).required(),
    email: joi.string().email({maxDomainSegments: 2, tlds: {allow: true}}).required(),
    password: joi.string().min(6).max(30).required(),
});


exports.getAllUsers = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM user',
            (err, results) => {
                if (err) {
                    reject(err);
                }
                resolve(results);
            });
    });
}


exports.register = (
    firstname,
    lastname,
    email,
    password,
    image,
    country,
    birthdate
) => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM user WHERE email = ?',
            [email],
            async (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (results.length > 0) {
                    reject('Email already exists');
                    return;
                }
                try {
                    const hash = await bcrypt.hash(password, 10);
                    const validation = await schemaValidation.validateAsync({
                        firstname,
                        lastname,
                        email,
                        password
                    });
                    if (validation.error) {
                        reject(validation.error.details[0].message);
                        return;
                    }
                    connection.query(`INSERT INTO user (firstname,lastname,email,password,image,country,birthdate) 
                        VALUES (?,?,?,?,?,?,?)`,
                        [firstname, lastname, email, hash, image, country, birthdate], (err, results) => {
                            if (err) {
                                reject(err);
                            }
                            resolve(results);
                        });
                } catch (error) {
                    reject(error.message);
                }
            });
    });
};




exports.login = (email, password) => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM user WHERE email = ?',
            [email],
            (err, results) => {
                if (err) {
                    reject(err);
                }
                if (results.length > 0) {
                    bcrypt.compare(password, results[0].password, (err, result) => {
                        if (err) {
                            reject(err);
                        }
                        if (result) {
                            const token = jwt.sign({
                                email: results[0].email,
                                userId: results[0].id

                            }, privateKey, {
                                expiresIn: '1h'
                            });
                            // The "Bearer" scheme is a standardized way to indicate that the token is being used for bearer authentication.
                            // It provides clear semantics and helps distinguish authentication tokens from other types of tokens.
                            const bearerToken = `Bearer ${token}`;
                            resolve(bearerToken);
                        } else {
                            reject('Wrong password');
                        }
                    });

                } else {
                    reject('Email not found');
                }
            });
    })
}

