var express = require('express');
var watchRouter = express.Router();
const watchController = require('../controllers/watchController');
const middlewareController = require('../middleware/middlewareController');

watchRouter.route('/')
    .get(watchController.getAllWatch)

watchRouter.route('/watch')
    .get(middlewareController.checkAdmin, watchController.getAllWatchbyAdmin)

watchRouter.route('/create-watch')
    .get(middlewareController.checkAdmin, watchController.showCreateWatchForm)
    .post(middlewareController.checkAdmin, watchController.insertWatch);

watchRouter.route('/watch/:id')
    .get(watchController.getWatchDetails)
    .delete(middlewareController.checkAdmin, watchController.deleteWatch);

watchRouter.route('/watch/:id/edit')
    .get(middlewareController.checkAdmin, watchController.showEditWatchForm)
    .post(middlewareController.checkAdmin, watchController.editWatch);

watchRouter.route('/watch/:id/comments')
    .post(middlewareController.isAuthenticated, watchController.addComment);
    
module.exports = watchRouter;
