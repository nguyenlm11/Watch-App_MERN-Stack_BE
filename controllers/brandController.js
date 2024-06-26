const Brand = require('../models/brand');
const Watch = require('../models/watch');

class BrandController {
    // Get all Brands
    async getAllBrand(req, res) {
        try {
            const brands = await Brand.find({});
            res.json(brands);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Add new Brand
    async insertBrand(req, res) {
        const brandName = req.body.brandName;

        try {
            const existingBrand = await Brand.findOne({ brandName });
            if (existingBrand) {
                return res.status(400).json({ error: 'Brand already exists' });
            }
            const newBrand = new Brand({ brandName });
            await newBrand.save();
            res.status(201).json(newBrand);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Delete Brand
    async deleteBrand(req, res) {
        const brandId = req.params.id;

        try {
            const deletedBrand = await Brand.findByIdAndDelete(brandId);
            if (!deletedBrand) {
                return res.status(404).json({ error: 'Brand not found' });
            }
            await Watch.deleteMany({ brand: brandId });
            res.status(200).json({ message: 'Brand deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Update Brand
    async updateBrand(req, res) {
        const brandId = req.params.id;
        const { brandName } = req.body;

        try {
            const brand = await Brand.findById(brandId);
            if (!brand) {
                return res.status(404).json({ error: 'Brand not found' });
            }

            const existingBrand = await Brand.findOne({ brandName, _id: { $ne: brandId } });
            if (existingBrand) {
                return res.status(400).json({ error: 'Brand already exists' });
            }

            brand.brandName = brandName;
            await brand.save();
            res.status(200).json(brand);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = new BrandController();
