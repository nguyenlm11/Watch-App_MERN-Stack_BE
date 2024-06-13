const User = require('../models/member');

class UserController {
    // Get all users
    getAllUser(req, res) {
        User.find({ isAdmin: false })
            .then((users) => {
                res.render('users/user-list.ejs', {
                    title: 'Watch App - Users',
                    userData: users
                });
            })
            .catch(err => res.status(500).send(err));
    }
}

module.exports = new UserController();