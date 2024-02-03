const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const joi = require('joi');
const connection = require('../db');
require('dotenv').config();

let privateKey = process.env.PRIVATE_KEY;
let refreshPrivateKey = process.env.REFRESH_PRIVATE_KEY;


const schemaValidation = joi.object({
    firstname: joi.string().min(2).max(30).alphanum().required()
        .messages({
            'string.base': 'firstname must be a string',
            'string.empty': 'firstname is required',
            'string.min': 'firstname must have at least {#limit} characters',
            'string.max': 'firstname must have at most {#limit} characters',
            'any.required': 'firstname is required',
            'string.alphanum': 'firstname must only contain alphanumeric characters',
        }),
    lastname: joi.string().min(2).max(30).alphanum().required()
        .messages({
            'string.base': 'lastname must be a string',
            'string.empty': 'lastname is required',
            'string.min': 'lastname must have at least {#limit} characters',
            'string.max': 'lastname must have at most {#limit} characters',
            'any.required': 'lastname is required',
            'string.alphanum': 'lastname must only contain alphanumeric characters',
        }),
    email: joi.string().email().required()
        .messages({
            'string.base': 'email must be a valid email address',
            'string.empty': 'email is required',
            'string.email': 'email must be a valid email address',
            'any.required': 'email is required',
        }),
    password: joi.string().min(6).max(30).required()
        .messages({
            'string.base': 'password must be a string',
            'string.empty': 'password is required',
            'string.min': 'password must have at least {#limit} characters',
            'string.max': 'password must have at most {#limit} characters',
            'any.required': 'password is required',
        }),
});



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
                    reject('Internal Server Error');
                    return;
                }
                if (results.length > 0) {
                    reject('Email already exists' );
                    return;
                }
                try {
                    const hash = await bcrypt.hash(password, 10);
                    const validation = await schemaValidation.validateAsync({
                        firstname,
                        lastname,
                        email,
                        password
                    }, { abortEarly: false });
                    if (validation.error) {
                        const errorMessages = validation.error.details.map((err) => err.message);
                        reject(errorMessages);
                        return;
                    }
                    connection.query(`INSERT INTO user (firstname,lastname,email,password,image,country,birthdate) 
                        VALUES (?,?,?,?,?,?,?)`,
                        [firstname, lastname, email, hash, image, country, birthdate], (err, results) => {
                            if (err) {
                                reject('Internal Server Error');
                            }
                            resolve(results);
                        });
                } catch (error) {
                    reject(error.details);
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
                    return reject('Internal Server Error');
                }
                if (results.length > 0) {
                    bcrypt.compare(password, results[0].password, (err, result) => {
                        if (err) {
                            return reject('Internal Server Error');
                        }
                        if (result) {
                            const refreshToken = jwt.sign({
                                userId: results[0].id
                            }, refreshPrivateKey);
                            const token = jwt.sign({
                                email: results[0].email,
                                userId: results[0].id,
                            }, privateKey, {
                                expiresIn: '900s'
                            });
                            // The "Bearer" scheme is a standardized way to indicate that the token is being used for bearer authentication.
                            // It provides clear semantics and helps distinguish authentication tokens from other types of tokens.
                            const bearerToken = `Bearer ${token}`;
                            resolve({user: results[0], token: bearerToken, refreshToken: refreshToken});
                        } else {
                            reject({ code: 400, message: 'Wrong password' });
                        }
                    });

                } else {
                    reject({ code: 400, message: 'Email not found' });
                }
            });
    })
}