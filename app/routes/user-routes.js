const router = require('express').Router();
const passport = require('../../server').passport;
const userController = require('../controllers/user.controller');

// Show login form
router.get('/login', userController.login);

// Process login form
router.post('/login', userController.validateLogin, passport.authenticate('local-login', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

// Show signup form
router.get('/signup', userController.signup);

// Process signup form
router.post('/signup', userController.validateSignup, passport.authenticate('local-signup', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.get('/account', userController.showAccount);

router.get('/admin', userController.admin);
router.get('/admin/allow/:username', userController.allowUser);
router.get('/admin/disallow/:username', userController.disallowUser);

// Logout
router.get('/logout', userController.logout);

module.exports = router;