var express = require('express');
var authRouter = express.Router();
const authController = require('../controllers/authController');
const middlewareController = require('../middleware/middlewareController');

authRouter.route('/register')
    .get(middlewareController.checkLogin, authController.showRegisterForm)
    .post(middlewareController.checkLogin, authController.register);

authRouter.route('/login')
    .get(middlewareController.checkLogin, authController.showLoginForm)
    .post(middlewareController.checkLogin, authController.login);

authRouter.route('/logout')
    .get(authController.logout);

authRouter.route('/profile')
    .get(middlewareController.authenticateJWT, authController.showProfile)
    .post(middlewareController.authenticateJWT, authController.updateProfile);

authRouter.route('/change-password')
    .get(middlewareController.authenticateJWT, authController.showChangePasswordForm)
    .post(middlewareController.authenticateJWT, authController.changePassword);



module.exports = authRouter;
