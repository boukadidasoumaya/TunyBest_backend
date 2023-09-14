const express = require('express');
const app = express();
const userRoute = require('./routes/user.route');
const authRoute = require('./routes/auth.route');
const path = require('path');
const seriesRoute = require('./routes/series.route')
const moviesRoute=require('./routes/movies.route')
const homeRoute =require('./routes/home.route')
const commentRoute = require('./routes/comment.route');
const categoryRoute = require('./routes/category.route');
const ratingRoute = require('./routes/rating.route');


const cookieParser = require('cookie-parser');

// for parsing cookies
app.use(cookieParser());

// for parsing multipart/form-data (file data)
// const multer = require('multer');

// for parsing application/json (body-parser) (json data)
app.use(express.json());

// for parsing application/x-www-form-urlencoded (form data)
// app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers',
        'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods',
        'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // Enable credentials
    next();
});



app.use('/',homeRoute);
app.use('/',authRoute);
app.use('/user',userRoute);
app.use('/series',seriesRoute);
app.use('/movies',moviesRoute);
app.use('/comment', commentRoute);
app.use('/category', categoryRoute);
app.use('/rating', ratingRoute);

app.listen(5000, () => {
    console.log('Server started!');
});