

module.exports = (app, passport, eventController) => {

    // Event routes
    app.get('/events', eventController.showEvents);

    // Seed events
    app.get('/events/seed', eventController.seedEvents);

    // Create events
    app.get('/events/create', eventController.showCreate);
    app.post('/events/create', eventController.processCreate);

    // Edit events
    app.get('/events/:slug/edit', eventController.showEdit);
    app.post('/events/:slug', eventController.processEdit);

    // Delete events
    app.get('/events/:slug/delete', eventController.deleteEvent);

    // Show single event
    app.get('/events/:slug', eventController.showSingle);
};
