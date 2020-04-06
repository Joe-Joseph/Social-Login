const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv');
const User = require('../models/users-models');

dotenv.config();

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
})

passport.use(
    new GoogleStrategy({
        // options for google strategy
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_SECRET_KEY,
        callbackURL: 'http://localhost:3000/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {
        // passport callback function
        User.findOne({googleId: profile.id}).then((currentUser) => {
            if(currentUser) {
                // User already exist
                // console.log('User exist', currentUser);
                done(currentUser);
            } else {
                // User not found
                const createUser = new User({
                    googleId: profile.id,
                    username: profile.displayName
                });
                createUser.save().then((newUser) => {
                    // console.log('new user created: ', createUser);
                    done(newUser);
                });
            }
        })
    })
);
