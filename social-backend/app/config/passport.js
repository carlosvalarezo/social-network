const JwtStategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');
const keys = require('../config/keys');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('JWT');
opts.secretOrKey = keys.secret;

module.exports = passport => {
    passport.use(new JwtStategy(opts, (jwtPayload, done)=>{
        console.log(jwtPayload);
    }));
};
