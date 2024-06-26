const express = require('express');
const router = express.Router();
const memberController = require('../controllers/authController');
const { authenticate, authorizedAdmin } = require('../middleware/middlewareController');


router.post('/register', memberController.register);
router.post('/login', memberController.login);
router.post('/logout', memberController.logout);
router.get('/profile', authenticate, memberController.getProfile);
router.put('/profile', authenticate, memberController.updateProfile);
router.put('/profile/change-password', authenticate, memberController.changePassword);

module.exports = router;