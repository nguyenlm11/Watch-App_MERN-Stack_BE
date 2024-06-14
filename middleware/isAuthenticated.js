function isAuthenticated(req, res, next) {
    if (req.user && !req.user.isAdmin) {
        return next();
    } else {
        res.redirect('/');
    }
}

module.exports = isAuthenticated;
