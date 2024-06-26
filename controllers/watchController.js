const Watch = require('../models/watch');
const Brand = require('../models/brand');

class WatchController {
    // Get all watch for Admin
    async getAllWatchbyAdmin(req, res) {
        try {
            const watches = await Watch.find({})
                .populate('brand');
            const brands = await Brand.find({});
            res.json({
                watches: watches,
                brands: brands
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Get all watch at Home
    async getAllWatch(req, res) {
        try {
            const perPage = 9;
            const page = parseInt(req.query.page) || 1;
            const skip = (perPage * page) - perPage;
            const searchQuery = req.query.search || '';
            const brandFilter = req.query.brand || '';

            let query = {};
            if (searchQuery) {
                query.watchName = { $regex: searchQuery, $options: 'i' };
            }
            if (brandFilter) {
                query.brand = brandFilter;
            }

            const watches = await Watch.find(query)
                .skip(skip)
                .limit(perPage)
                .populate('brand');

            const totalWatches = await Watch.countDocuments(query);
            const brands = await Brand.find({});

            res.json({
                watches: watches,
                brands: brands,
                totalPages: Math.ceil(totalWatches / perPage),
                currentPage: page,
                searchQuery: searchQuery,
                selectedBrand: brandFilter
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Add new watch
    async insertWatch(req, res) {
        try {
            const watchData = req.body;
            const watch = new Watch(watchData);
            await watch.save();
            res.json({ message: 'Watch added successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Watch detail
    async getWatchDetails(req, res) {
        try {
            const watch = await Watch.findById(req.params.id)
                .populate('brand', 'brandName')
                .populate('comments.author', 'membername');
            if (!watch) return res.status(404).json({ error: 'Watch not found' });
            res.json(watch);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Add comment to watch
    addCommentToWatch = async (req, res) => {
        const { rating, content } = req.body;
        try {
            const watch = await Watch.findById(req.params.id);
            if (!watch) {
                return res.status(404).json({ error: 'Watch not found' });
            }
            if (req.member.isAdmin) {
                return res.status(400).json({ error: 'Admin cannot comment' });
            }
            const existingComment = watch.comments.find(comment => comment.author.toString() === req.member._id.toString());
            if (existingComment) {
                return res.status(400).json({ error: 'You have already commented' });
            }
            const newComment = {
                rating,
                content,
                author: req.member._id,

            };
            watch.comments.push(newComment);
            await watch.save();
            await watch.populate('comments.author', 'membername');
            res.status(201).json(watch);
        } catch (err) {
            console.error('Error adding comment:', err);
            res.status(500).json({ error: err.message });
        }
    };

    // Delete watch
    async deleteWatch(req, res) {
        try {
            const watchId = req.params.id;
            await Watch.findByIdAndDelete(watchId);
            res.json({ message: 'Watch deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Edit watch
    async editWatch(req, res) {
        try {
            const watchId = req.params.id;
            const updatedData = req.body;

            const updatedWatch = await Watch.findByIdAndUpdate(
                watchId,
                updatedData,
                { new: true }
            ).populate('brand');

            if (!updatedWatch) {
                return res.status(404).json({ message: 'Watch not found' });
            }
            res.json({ watch: updatedWatch });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = new WatchController();
