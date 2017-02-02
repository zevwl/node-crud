const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

const mainController = require('./controllers/main.controller');
const eventController = require('./controllers/event.controller.js');
const userController = require('./controllers/user.controller');

const adminRoutes = require('./access-controll/admin-routs');
const authorizedRoutes = require('./access-controll/authorized-routs');
const authenticatedRoutes = require('./access-controll/authenticated-routs');

// Export router
module.exports = (app, passport) => {

    // Main routes
    app.get('/', mainController.showHome);

    app.all(adminRoutes, ensureLoggedIn(), userController.adminOnly);
    app.all(authorizedRoutes, ensureLoggedIn(), userController.authorizedOnly);
    app.all(authenticatedRoutes, ensureLoggedIn());

    // Event routes
    require('./routes/event-routes')(app, passport, eventController);

    // User routes
    require('./routes/user-routes')(app, passport, userController);

    // 404 route
    app.get('*', mainController.notFound);
};
