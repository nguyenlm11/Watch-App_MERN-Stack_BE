const Brand = require('../models/brand');
const Watch = require('../models/watch');

class BrandController {
    // Get all Brands
    getAllBrand(req, res) {
        Brand.find({})
            .then((brands) => {
                res.render('brands/brand-list.ejs', {
                    title: 'Watch App - Brands',
                    brandData: brands
                });
            })
            .catch(err => res.status(500).send(err));
    }

    // Add new Brand
    insertBrand(req, res) {
        const br = new Brand(req.body);
        br.save()
            .then(() => res.redirect('/brand'))
            .catch(err => res.status(500).send(err));
    }
    // Delete Brand
    deleteBrand(req, res) {
        const brandId = req.params.id;
        Brand.findByIdAndDelete(brandId)
            .then(() => {
                return Watch.deleteMany({ brand: brandId });
            })
            .then(() => res.redirect('/brand'))
            .catch(err => res.status(500).send(err));
    }
    
    // Edit Brand Form
    editBrandForm(req, res) {
        const brandId = req.params.id;
        Brand.findById(brandId)
            .then((brand) => {
                res.render('brands/edit-brand.ejs', {
                    title: 'Edit Brand',
                    brand: brand
                });
            })
            .catch(err => res.status(500).send(err));
    }

    // Update Brand
    updateBrand(req, res) {
        const brandId = req.params.id;
        Brand.findByIdAndUpdate(brandId, req.body, { new: true })
            .then(() => res.redirect('/brand'))
            .catch(err => res.status(500).send(err));
    }
}

module.exports = new BrandController();
