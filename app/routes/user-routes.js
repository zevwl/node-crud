

module.exports = (app, passport, userController) => {

    // Show login form
    app.get('/login', userController.login);

    // Process login form
    app.post('/login', userController.validateLogin, passport.authenticate('local-login', {
        successReturnToOrRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }));

    // Show signup form
    app.get('/signup', userController.signup);

    // Process signup form
    app.post('/signup', userController.validateSignup, passport.authenticate('local-signup', {
        successReturnToOrRedirect: '/',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    app.get('/account', userController.showAccount);

    // Logout
    app.get('/logout', userController.logout);
};
