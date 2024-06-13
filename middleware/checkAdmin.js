function checkAdmin(req, res, next) {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.redirect('/');
    }
}

module.exports = checkAdmin;
