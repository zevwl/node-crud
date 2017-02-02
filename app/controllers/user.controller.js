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
