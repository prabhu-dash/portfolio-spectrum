const express = require("express");
const path = require("path");
const mysql = require("mysql");
const env = require("dotenv");
const cookieParser = require("cookie-parser");

env.config({ path: './password.env'});

const app = express();
const db = mysql.createConnection({
    host: process.env.dbs_host,
    user: process.env.dbs_user,
    password: process.env.dbs_password,
    database: process.env.dbs
});

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

app.use('/static', express.static('static'));

app.use('/images', express.static('images'));

app.use(express.urlencoded({extended: false }));

app.use(express.json());

app.use(cookieParser());

app.set('view engine', 'hbs', 'html');

db.connect( (error) => {
    if(error) {
        console.log(error)
    }
        else {
            console.log("MYSQL Connected")
        }
} );

app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

// app.get('/home', function(req, res) {
//     res.sendFile('Spectrum/portfolio.html',{root: __dirname});
// });

app.get('/portfolio', function(req, res) {
    res.sendFile('Spectrum/portfolio.html',{root: __dirname});
});

app.get('/index', function(req, res) {
    res.redirect('/portfolio');
});

app.get('/logout', function(req, res) {
    res.redirect('/');
});

app.listen(8080, () => {
    console.log("Server running at 8080");
});