const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth');

const User = require('../app/models/user');

const auth = require('./auth');

module.exports = (passport) => {


    //==================================================
    // Passport session setup
    //
    // Required for persistent login sessions
    // Passport needs ability to serialize and deserialize users out of session
    //==================================================

    // Used to serialize the user for the session
    passport.serializeUser((user, done) => done(null, user.id));

    // Used to deserialize user
    passport.deserializeUser((id, done) => User.findById(id, (err, user) => done(err, user)));


    //==================================================
    // Local SIGNUP
    //
    // We are suing named strategies since we have one for login and one for signup
    // By default, if there was no name, it would just be called 'local'
    //==================================================

    passport.use('local-signup', new LocalStrategy({
        username: 'username',
        password: 'password',
        passReqToCallback: true
    }, (req, username, password, done) => {

        if (username) username = username.toLowerCase();

        process.nextTick(() => {
            User.findOne({ 'username': username }, (err, user) => {
                if (err) return done(err);

                let body = req.body;

                if (user) {
                    return done(null, false, req.flash('error', 'This username is already taken.'));
                } else if (body.password !== body['password.again']) {
                    return done(null, false, req.flash('error', 'Passwords don\'t match, try again.'));
                } else {

                    let newUser = new User();
                    newUser.first_name = body['name.first'];
                    newUser.last_name = body['name.last'];
                    newUser.username = username;
                    newUser.email = body.email.toLowerCase();
                    newUser.password = newUser.generateHash(password);

                    newUser.save((err) => {
                        if (err) throw err;

                        return done(null, newUser);
                    });
                }
            });
        });
    }));


    //==================================================
    // Local LOGIN
    //==================================================

    passport.use('local-login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, (req, username, password, done) => {

        if (username) username = username.toLowerCase();

        process.nextTick(() => {

            User.findOne({ 'username': username }, (err, user) => {

                if (err) return done(err);

                if (!user) return done(null, false, req.flash('error', 'No user found.'));

                if (!user.validPassword(password)) return done(null, false, req.flash('error', 'Wrong password.'));

                return done(null, user);
            });
        });
    }));
};
