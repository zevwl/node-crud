// Create a new express router
const express = require('express');
const router = express.Router();
const mainController = require('./controllers/main.controller');
const eventController = require('./controllers/event.controller.js');

// Export router
module.exports = (app, passport) => {

    // Main routes
    app.get('/', mainController.showHome);

// Create events
router.get('/events/create', eventsController.showCreate);
router.post('/events/create', eventsController.processCreate);

    // Event routes
    require('./routes/event-routes')(app, passport, eventController, userController);

// Delete events
router.get('/events/:slug/delete', eventsController.deleteEvent);

    // 404 route
    app.get('*', mainController.notFound);
};
