const router = require('express').Router();
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

const eventRoutes = require('./routes/event-routes');
const userRoutes = require('./routes/user-routes');

const adminRoutes = require('./access-controll/admin-routes');
const authorizedRoutes = require('./access-controll/authorized-routes');
const authenticatedRoutes = require('./access-controll/authenticated-routes');

const mainController = require('./controllers/main.controller');
const userController = require('./controllers/user.controller');


// Main routes
router.get('/', mainController.showHome);

router.all(adminRoutes, ensureLoggedIn(), userController.adminOnly);
router.all(authorizedRoutes, ensureLoggedIn(), userController.authorizedOnly);
router.all(authenticatedRoutes, ensureLoggedIn());

// Event routes
router.use('/events', eventRoutes);

// User routes
router.use('/', userRoutes);

// 404 route
router.get('*', mainController.notFound);

// Export router
module.exports = router;
