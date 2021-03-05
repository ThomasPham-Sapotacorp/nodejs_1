var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  console.log("Hello");
  res.render('pages/contact/index', { title: 'Contact' });
});


module.exports = router;
