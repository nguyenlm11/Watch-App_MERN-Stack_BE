const User = require('../models/member');

class UserController {
    // Get all users
    getAllUser(req, res) {
        const page = parseInt(req.query.page) || 1;
        const perPage = 10;
        const skip = (perPage * page) - perPage;
        
        User.find({ isAdmin: false })
            .skip(skip)
            .limit(perPage)
            .then((users) => {
                User.countDocuments({ isAdmin: false }).then((totalUsers) => {
                    res.render('users/user-list.ejs', {
                        title: 'Watch App - Users',
                        userData: users,
                        currentPage: page,
                        totalPages: Math.ceil(totalUsers / perPage),
                        perPage: perPage
                    });
                });
            })
            .catch(err => res.status(500).send(err));
    }
}

module.exports = new UserController();