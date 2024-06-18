const Brand = require('../models/brand');
const Watch = require('../models/watch');

class BrandController {
    // Get all Brands
    async getAllBrand(req, res) {
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
        const brandName = req.body.brandName;

        Brand.findOne({ brandName: brandName })
            .then(existingBrand => {
                if (existingBrand) {
                    res.render('brands/create-brand.ejs', {
                        title: 'Add New Brand',
                        error: 'Brand already exists'
                    });
                } else {
                    const br = new Brand({ brandName: brandName });
                    br.save()
                        .then(() => res.redirect('/brand'))
                        .catch(err => res.status(500).send(err));
                }
            })
            .catch(err => res.status(500).send(err));
    }

    // Delete Brand
    deleteBrand(req, res) {
        const brandId = req.params.id;
        Brand.findByIdAndDelete(brandId)
            .then(deleteBrand => {
                if (!deleteBrand) {
                    return res.status(404).send('Brand not found');
                }
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
        const BrandName = req.body.brandName;

        Brand.findById(brandId)
            .then((brand) => {
                if (!brand) {
                    return res.status(404).send('Brand not found');
                }

                Brand.findOne({ brandName: BrandName, _id: { $ne: brandId } })
                    .then((existingBrand) => {
                        if (existingBrand) {
                            return res.render('brands/edit-brand.ejs', {
                                title: 'Edit Brand',
                                brand: brand,
                                error: 'Brand already exists'
                            });
                        }
                        Brand.findByIdAndUpdate(brandId, req.body, { new: true })
                            .then(() => res.redirect('/brand'))
                            .catch((err) => res.status(500).send(err));
                    })
                    .catch((err) => res.status(500).send(err));
            })
            .catch((err) => res.status(500).send(err));
    }
}

module.exports = new BrandController();
