const User = require('../models/member');

class UserController {
    // Get all users
    getAllUser(req, res) {
        User.find({ isAdmin: false })
            .then((users) => {
                res.json({ users });
            })
            .catch(err => res.status(500).send(err));
    }
}

module.exports = new UserController();
