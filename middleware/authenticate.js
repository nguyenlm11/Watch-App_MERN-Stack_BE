const jwt = require('jsonwebtoken');
const Member = require('../models/member');
const SECRET_KEY = '12345-67890-09876-54321';

function authenticateJWT(req, res, next) {
    const token = req.session.token;

    if (token) {
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.redirect('/auth/login');
            }

            Member.findById(decoded.id)
                .then(user => {
                    if (!user) {
                        return res.redirect('/auth/login');
                    }
                    req.user = user;
                    next();
                })
                .catch(err => {
                    res.status(500).send('Server error');
                });
        });
    } else {
        next();
    }
}

module.exports = authenticateJWT;
