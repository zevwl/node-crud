const moment = require('moment');
const User = require('../models/user');
const mail = require('../controllers/mail.controller');

module.exports = {

    adminOnly: (req, res, next) => {
        if (req.user && !req.user.isAdmin) {
            req.flash('error', 'This task requires admin privileges.');
            res.redirect('/');
        } else {
            next();
        }
    },

    authorizedOnly: (req, res, next) => {
        if (req.user && !req.user.isAllowed) {
            req.flash('error', 'You are not allowed yet.');
            res.redirect('/');
        } else {
            next();
        }
    },

    admin: (req, res) => {
        User.find({}, (err, data) => {
            if (err) res.send(err);

            res.render('pages/admin', {
                userList: data,
                moment: moment
            });
        });
    },

    allowUser: (req, res) => {
        User.findOne({ username: req.params.username }, (err, user) => {
            user.isAllowed = true;

            user.save((err) => {
                if (err) throw err;

                mail.sendSimple(user.email, 'You are allowed!', 'Congratulations! You are now allowed to browse our website.');
                req.flash('success', 'User allowed!');
                res.redirect('/admin');
            });
        });
    },

    disallowUser: (req, res) => {
        User.findOne({ username: req.params.username }, (err, user) => {
            user.isAllowed = false;

            user.save((err) => {
                if (err) throw err;

                req.flash('error', 'User disallowed.');
                res.redirect('/admin');
            });
        });
    },

    login: (req, res) => {
        res.render('pages/login');
    },

    logout: (req, res) => {
        req.logout();
        res.redirect('/');
    },

    signup: (req, res) => {
        res.render('pages/signup');
    },

    validateLogin: (req, res, next) => {
        req.checkBody({
            'username': {
                notEmpty: {
                    errorMessage: 'Username is required.'
                }
            },
            'password': {
                notEmpty: {
                    errorMessage: 'Password is required.'
                }
            }
        });

        req.getValidationResult().then((result) => {

            if (!result.isEmpty()) {

                // If there are errors, save errors to flash and redirect
                req.flash('error', result.useFirstErrorOnly().array().map(err => err.msg));
                res.redirect('/login');

            } else {
                next();
            }

        });
    },

    validateSignup: (req, res, next) => {
        req.checkBody({
            'name.first': {
                notEmpty: {
                    errorMessage: 'First name is required.'
                }
            },
            'name.last': {
                notEmpty: {
                    errorMessage: 'Last name is required.'
                }
            },
            'username': {
                notEmpty: {
                    errorMessage: 'Username is required.'
                },
                isLength: {
                    options: { min: 5 },
                    errorMessage: 'Username must be at least 5 characters.'
                },
                isAlphanumeric: {
                    errorMessage: 'Username must contain alphanumeric characters only.'
                }
            },
            'email': {
                notEmpty: {
                    errorMessage: 'Email is required.',
                },
                isEmail: {
                    errorMessage: 'Invalid email.'
                }
            },
            'password': {
                notEmpty: {
                    errorMessage: 'Password is required.'
                }
            },
            'password.again': {
                notEmpty: {
                    errorMessage: 'Password is required twice.'
                }
            }
        });

        req.getValidationResult().then((result) => {

            if (!result.isEmpty()) {

                // If there are errors, save errors to flash and redirect
                req.flash('error', result.useFirstErrorOnly().array().map(err => err.msg));
                res.redirect('/signup');
            } else {
                next();
            }

        });
    },

    showAccount: (req, res) => res.render('pages/account')
};
