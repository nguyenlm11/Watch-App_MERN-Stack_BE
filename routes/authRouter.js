var express = require('express');
var authRouter = express.Router();
const authController = require('../controllers/authController');
const checkLogin = require('../middleware/checkLogin')
const authenticate = require('../middleware/authenticate');

authRouter.route('/register')
    .get(checkLogin, authController.showRegisterForm)
    .post(checkLogin, authController.register);

authRouter.route('/login')
    .get(checkLogin, authController.showLoginForm)
    .post(checkLogin, authController.login);

authRouter.route('/logout')
    .get(authController.logout);

authRouter.route('/profile')
    .get(authenticate, authController.showProfile)
    .post(authenticate, authController.updateProfile);

authRouter.route('/change-password')
    .get(authenticate, authController.showChangePasswordForm)
    .post(authenticate, authController.changePassword);



module.exports = authRouter;
