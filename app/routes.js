// Create a new express router
const express = require('express');
const router = express.Router();
const mainController = require('./controllers/main.controller');
const eventsController = require('./controllers/events.controller');

// Export router
module.exports = router;

// Define routes
// Main routes
router.get('/', mainController.showHome);

// Event routes
router.get('/events', eventsController.showEvents);

// Create events
router.get('/events/create', eventsController.showCreate);
router.post('/events/create', eventsController.processCreate);

// Edit events
router.get('/events/:slug/edit', eventsController.showEdit);
router.post('/events/:slug', eventsController.processEdit);

// Delete events
router.get('/events/:slug/delete', eventsController.deleteEvent);

// Show single event
router.get('/events/:slug', eventsController.showSingle);