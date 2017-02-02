const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

const mainController = require('./controllers/main.controller');
const eventController = require('./controllers/event.controller.js');
const userController = require('./controllers/user.controller');

// Export router
module.exports = (app, passport) => {

    // Main routes
    app.get('/', mainController.showHome);

    // Only authenticated users should be allowed to event routes
    app.all('/events/*', userController.authorizedOnly, ensureLoggedIn());
    app.all(['/account', '/events'], ensureLoggedIn());

    // Event routes
    require('./routes/event-routes')(app, passport, eventController, userController);

    // User routes
    require('./routes/user-routes')(app, passport, userController);

    // 404 route
    app.get('*', mainController.notFound);
};
