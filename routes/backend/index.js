var express = require('express');
var router = express.Router();

var homeRouter = require('./home');
var itemsRouter = require('./items');
var dashboardRouter = require('./dashboard');
var contactRouter = require('./contact');


router.use('/', homeRouter);
router.use('/dashboard', dashboardRouter);
router.use('/contact', contactRouter);
router.use('/items', itemsRouter);

module.exports = router;
