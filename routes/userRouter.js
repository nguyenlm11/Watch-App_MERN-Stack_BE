var express = require('express');
var userRouter = express.Router();
const userController = require('../controllers/userController');
const middlewareController = require('../middleware/middlewareController');


userRouter.route('/')
    .get(middlewareController.checkAdmin, userController.getAllUser);

module.exports = userRouter;
