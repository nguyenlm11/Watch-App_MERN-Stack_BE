var express = require('express');
var userRouter = express.Router();
const userController = require('../controllers/userController');
const checkAdmin = require('../middleware/checkAdmin');

userRouter.route('/')
    .get(checkAdmin, userController.getAllUser)

module.exports = userRouter;
