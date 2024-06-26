var express = require('express');
var brandRouter = express.Router();
const brandController = require('../controllers/brandController');
const { authenticate, authorizedAdmin } = require('../middleware/middlewareController');

brandRouter.route('/')
    .get(authenticate, authorizedAdmin, brandController.getAllBrand)
    .post(authenticate, authorizedAdmin, brandController.insertBrand)

brandRouter.route('/:id')
    .put(authenticate, authorizedAdmin, brandController.updateBrand)
    .delete(authenticate, authorizedAdmin, brandController.deleteBrand);

module.exports = brandRouter;
