const router = require('express').Router();
const eventController = require('../controllers/event.controller');

// Event routes
router.get('/', eventController.showEvents);

// Seed events
router.get('/seed', eventController.seedEvents);

// Create events
router.route('/create')
    .get(eventController.showCreate)
    .post(eventController.processCreate);

// Edit events
router.get('/:slug/edit', eventController.showEdit);
router.post('/:slug', eventController.processEdit);

// Delete events
router.get('/:slug/delete', eventController.deleteEvent);

// Show single event
router.get('/:slug', eventController.showSingle);

module.exports = router;