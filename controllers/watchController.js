const Watch = require('../models/watch');
const Brand = require('../models/brand');
const Comment = require('../models/comment');
const Member = require('../models/member');

class WatchController {
    // Get all Watches for admin
    getAllWatchbyAdmin(req, res) {
        const page = parseInt(req.query.page) || 1;
        const perPage = 5;
        const skip = (perPage * page) - perPage;

        Watch.find({})
            .populate('brand')
            .skip(skip)
            .limit(perPage)
            .then((watches) => {
                Watch.countDocuments({}).then((totalWatches) => {
                    Brand.find({}).then((brands) => {
                        res.render('watches/watch-list.ejs', {
                            title: 'Watch App - Watches',
                            brands: brands,
                            watchData: watches,
                            totalPages: Math.ceil(totalWatches / perPage),
                            currentPage: page
                        });
                    });
                });
            })
            .catch(err => res.status(500).send(err));
    }


    // Get all Watches at index.ejs
    getAllWatch(req, res) {
        const perPage = 6;
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
        Watch.find(query)
            .skip(skip)
            .limit(perPage)
            .populate('brand')
            .then((watches) => {
                Watch.countDocuments(query).then((totalWatches) => {
                    Brand.find({}).then((brands) => {
                        res.render('index', {
                            title: 'Watch App',
                            watchData: watches,
                            current: page,
                            pages: Math.ceil(totalWatches / perPage),
                            searchQuery: searchQuery,
                            brands: brands,
                            selectedBrand: brandFilter
                        });
                    });
                });
            })
            .catch(err => res.status(500).send(err));
    }

    // Show form to create a new watch
    showCreateWatchForm(req, res) {
        Brand.find({})
            .then((brands) => {
                res.render('watches/create-watch.ejs', {
                    title: 'Create New Watch',
                    brandData: brands
                });
            })
            .catch(err => res.status(500).send(err));
    }

    // Add new Watch
    insertWatch(req, res) {
        const watchData = req.body;
        watchData.Automatic = watchData.Automatic === "on";
        const watch = new Watch(watchData);
        watch.save()
            .then(() => res.redirect('/watch'))
            .catch(err => res.status(500).send(err));
    }

    // Get watch details
    getWatchDetails(req, res) {
        const watchId = req.params.id;
        Watch.findById(watchId)
            .populate('brand comments')
            .populate({
                path: 'comments',
                populate: { path: 'author', model: 'Member' }
            })
            .then((watch) => {
                if (!watch) {
                    return res.status(404).send('Watch not found');
                }
                const hasCommented = req.user ? watch.comments.some(comment => comment.author._id.equals(req.user._id)) : false;
                res.render('watches/watch-details.ejs', {
                    title: 'Watch Details',
                    watch: watch,
                    hasCommented: hasCommented
                });
            })
            .catch(err => res.status(500).send(err));
    }

    // Add comment to a watch
    addComment(req, res) {
        const watchId = req.params.id;
        const { rating, content } = req.body;
        const author = req.user._id;

        Watch.findById(watchId)
            .populate('comments')
            .then((watch) => {
                if (!watch) {
                    return res.status(404).send('Watch not found');
                }

                const hasCommented = watch.comments.some(comment => comment.author.equals(author));
                if (hasCommented) {
                    return res.status(400).send('You have already commented on this watch');
                }

                const newComment = new Comment({
                    rating,
                    content,
                    author
                });

                newComment.save()
                    .then((savedComment) => {
                        watch.comments.push(savedComment._id);
                        return watch.save();
                    })
                    .then(() => res.redirect(`/watch/${watchId}`))
                    .catch(err => res.status(500).send(err));
            })
            .catch(err => res.status(500).send(err));
    }

    // Delete Watch
    deleteWatch(req, res) {
        const watchId = req.params.id;
        Watch.findByIdAndDelete(watchId)
            .then(() => res.redirect('/watch'))
            .catch(err => res.status(500).send(err));
    }

    // Show form to edit watch
    showEditWatchForm(req, res) {
        const watchId = req.params.id;
        Watch.findById(watchId)
            .populate('brand')
            .then((watch) => {
                if (!watch) {
                    return res.status(404).send('Watch not found');
                }
                Brand.find({})
                    .then((brands) => {
                        res.render('watches/edit-watch.ejs', {
                            title: 'Edit Watch',
                            watch: watch,
                            brandData: brands
                        });
                    })
                    .catch(err => res.status(500).send(err));
            })
            .catch(err => res.status(500).send(err));
    }

    // Edit watch
    editWatch(req, res) {
        const watchId = req.params.id;
        const updatedData = req.body;
        updatedData.Automatic = updatedData.Automatic === "on";

        Watch.findByIdAndUpdate(watchId, updatedData, { new: true })
            .then((updatedWatch) => {
                if (!updatedWatch) {
                    return res.status(404).send('Watch not found');
                }
                res.redirect('/watch');
            })
            .catch(err => res.status(500).send(err));
    }
}

module.exports = new WatchController();
