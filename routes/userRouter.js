var express = require('express');
var userRouter = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorizedAdmin } = require('../middleware/middlewareController');

userRouter.route('/')
    .get(authenticate, authorizedAdmin, userController.getAllUser);

module.exports = userRouter;
