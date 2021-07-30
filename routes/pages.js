const express = require("express");

const router = express.Router();

router.get('/', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('details');
});

router.get('/portfolio', (req, res) => {
    res.render('portfolio');
});

module.exports = router;

