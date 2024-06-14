var express = require('express');
var watchRouter = express.Router();
const watchController = require('../controllers/watchController');
const checkAdmin = require('../middleware/checkAdmin');
const isAuthenticated = require('../middleware/isAuthenticated');

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

watchRouter.route('/watch/:id/comments')
    .post(isAuthenticated, watchController.addComment);
    
module.exports = watchRouter;
