const Watch = require('../models/watch');
const Brand = require('../models/brand');

class WatchController {
    //Get all Watches by admin
    getAllWatchbyAdmin(req, res) {
        Watch.find({})
            .populate('brand')
            .then((watches) => {
                Brand.find({}).then((brands) => {
                    res.render('watches/watch-list.ejs', {
                        title: 'Watch App - Watches',
                        brands: brands,
                        watchData: watches
                    });
                });
            })
            .catch(err => res.status(500).send(err));
    }

    // Get all Watches in Index
    getAllWatch(req, res) {
        const perPage = 6;
        const page = parseInt(req.query.page) || 1;
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
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .populate('brand')
            .then((watches) => {
                Watch.countDocuments(query).then((count) => {
                    Brand.find({}).then((brands) => {
                        res.render('index', {
                            title: 'Watch App',
                            watchData: watches,
                            current: page,
                            pages: Math.ceil(count / perPage),
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
            .populate('brand')
            .then((watch) => {
                if (!watch) {
                    return res.status(404).send('Watch not found');
                }
                res.render('watches/watch-details.ejs', {
                    title: 'Watch Details',
                    watch: watch
                });
            })
            .catch(err => res.status(500).send(err));
    }

    //Delete Watch
    deleteWatch(req, res) {
        const watchId = req.params.id;
        Watch.findByIdAndDelete(watchId)
            .then(() => res.redirect('/watch'))
            .catch(err => res.status(500).send(err));
    }

    //Show form to edit watch
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

    //Edit watch
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
