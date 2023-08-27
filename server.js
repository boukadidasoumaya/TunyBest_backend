const express = require('express');
const app = express();
const userRoute = require('./routes/user.route');
const path = require('path');
const seriesRoute = require('./routes/series.route')
const moviesRoute=require('./routes/movies.route')
const homeRoute =require('./routes/home.route')




app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// for parsing multipart/form-data (file data)
// const multer = require('multer');


// for parsing application/json (body-parser) (json data)
app.use(express.json());

// for parsing application/x-www-form-urlencoded (form data)
// app.use(express.urlencoded({ extended: true }));



app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers',
        'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods',
        'GET, POST, PUT, PATCH, DELETE');
    next();
});



app.use('/',userRoute);

app.use('/',homeRoute);
// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });


app.use('/series',seriesRoute);
app.use('/movies',moviesRoute);



app.listen(5000, () => {
    console.log('Server started!');
});