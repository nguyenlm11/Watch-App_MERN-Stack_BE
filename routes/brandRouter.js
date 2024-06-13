var express = require('express');
var brandRouter = express.Router();
const brandController = require('../controllers/brandController');
const checkAdmin = require('../middleware/checkAdmin');

brandRouter.route('/')
    .get(checkAdmin, brandController.getAllBrand)
    .post(checkAdmin, brandController.insertBrand)

brandRouter.route('/:id')
    .put(checkAdmin, brandController.updateBrand)
    .delete(checkAdmin, brandController.deleteBrand);

brandRouter.route('/:id/edit')
    .get(checkAdmin, brandController.editBrandForm);

brandRouter.get('/new', checkAdmin, (req, res) => {
    res.render('brands/create-brand.ejs', {
        title: 'Add New Brand'
    });
});

module.exports = brandRouter;
