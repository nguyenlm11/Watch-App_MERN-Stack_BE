const jwt = require('jsonwebtoken');
const Member = require('../models/member');

const SECRET_KEY = '12345-67890-09876-54321';

const authenticate = async (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (token) {
        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            req.member = await Member.findById(decoded.memberId).select('-password');
            next();
        } catch (error) {
            res.status(401).json({ error: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ error: 'Not authorized, no token' });
    }
};

const authorizedAdmin = (req, res, next) => {
    if (req.member && req.member.isAdmin) {
        next();
    } else {
        res.status(401).json({ error: 'Not authorized as an admin' });
    }
};

module.exports = {
    authenticate,
    authorizedAdmin
};