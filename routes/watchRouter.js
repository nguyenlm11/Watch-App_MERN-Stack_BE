var express = require('express');
var watchRouter = express.Router();
const watchController = require('../controllers/watchController');
const checkAdmin = require('../middleware/checkAdmin');

watchRouter.route('/')
    .get(watchController.getAllWatch)
// .post(watchController.insertWatch);

watchRouter.route('/watch')
    .get(checkAdmin, watchController.getAllWatchbyAdmin)

watchRouter.route('/create-watch')
    .get(checkAdmin, watchController.showCreateWatchForm)
    .post(checkAdmin, watchController.insertWatch);

watchRouter.route('/watch/:id')
    .get(watchController.getWatchDetails)
    .delete(checkAdmin, watchController.deleteWatch);

watchRouter.route('/watch/:id/edit')
    .get(checkAdmin, watchController.showEditWatchForm)
    .post(checkAdmin, watchController.editWatch);

module.exports = watchRouter;
