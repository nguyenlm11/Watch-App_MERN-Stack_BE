const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const Member = require('../models/member'); 
const SECRET_KEY = '12345-67890-09876-54321'; 

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET_KEY,
};

module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        Member.findById(jwt_payload.id)
            .then(member => {
                if (member) {
                    return done(null, member);
                }
                return done(null, false);
            })
            .catch(err => done(err, false));
    }));
};
