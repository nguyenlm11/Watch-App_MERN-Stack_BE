const express = require('express');
const watchRouter = express.Router();
const watchController = require('../controllers/watchController');
const { authenticate, authorizedAdmin } = require('../middleware/middlewareController');

watchRouter.route('/')
    .get(watchController.getAllWatch);

watchRouter.route('/watches')
    .get(authenticate, authorizedAdmin, watchController.getAllWatchbyAdmin)
    .post(authenticate, authorizedAdmin, watchController.insertWatch);

watchRouter.route('/watches/:id')
    .get(watchController.getWatchDetails)
    .put(authenticate, authorizedAdmin, watchController.editWatch)
    .delete(authenticate, authorizedAdmin, watchController.deleteWatch);

watchRouter.route('/watches/:id/comments')
    .post(authenticate, watchController.addCommentToWatch);

module.exports = watchRouter;
