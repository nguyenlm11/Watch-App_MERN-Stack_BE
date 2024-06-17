var express = require('express');
var brandRouter = express.Router();
const brandController = require('../controllers/brandController');
const middlewareController = require('../middleware/middlewareController');

brandRouter.route('/')
    .get(middlewareController.checkAdmin, brandController.getAllBrand)
    .post(middlewareController.checkAdmin, brandController.insertBrand)

brandRouter.route('/:id')
    .put(middlewareController.checkAdmin, brandController.updateBrand)
    .delete(middlewareController.checkAdmin, brandController.deleteBrand);

brandRouter.route('/:id/edit')
    .get(middlewareController.checkAdmin, brandController.editBrandForm);

brandRouter.get('/new', middlewareController.checkAdmin, (req, res) => {
    res.render('brands/create-brand.ejs', {
        title: 'Add New Brand'
    });
});

module.exports = brandRouter;
