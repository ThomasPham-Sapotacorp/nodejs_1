var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  console.log("Hello");
  res.render('pages/dashboard/index', { title: 'Dashboard Page' });
});

module.exports = router;
