var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("Hello");
  res.render('pages/home/index', { title: 'Home Page' });
});



module.exports = router;
