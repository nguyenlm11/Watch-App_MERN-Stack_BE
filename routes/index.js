var express = require('express');
var router = express.Router();
const watchController = require('../controllers/watchController');

router.route('/')
  .get(watchController.getAllWatch)

module.exports = router;
