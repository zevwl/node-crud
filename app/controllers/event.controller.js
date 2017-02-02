const Event = require('../models/event');

module.exports = {


    /**
     * Seed the database
     */
    seedEvents: (req, res) => {
        // create some events
        const events = [
            { name: 'Basketball', description: 'Throwing into a basket.' },
            { name: 'Swimming', description: 'Michael Phelps is the fast fish.' },
            { name: 'Weightlifting', description: 'Lifting heavy things up' },
            { name: 'Ping Pong', description: 'Super fast paddles' }
        ];

        // use the Event model to insert/save
        Event.remove({}, () => {
            for (event of events) {
                let newEvent = new Event(event);
                newEvent.save();
            }
        });

        // seeded!
        res.send('Database seeded!');
    },

    /**
     * Show all events
     */
    showEvents: (req, res) => {

        // Get all events
        Event.find({}, (err, events) => {
            if (err) {
                console.log(err);
                res.status(404);
                res.send('Events not found.');
            }

            res.render('pages/events', {
                events: events,
                success: req.flash('success')
            });
        });
    },

    /**
     * Show single event
     */
    showSingle: (req, res) => {

        Event.findOne({slug: req.params.slug}, (err, event) => {
            if (err) {
                console.log(err);
                res.status(404);
                res.send('Event not found.');
            }

            // Prevent user from inserting custom url
            if (!event) {
                res.redirect('/events');
            }

            res.render('pages/single', {
                event: event,
                success: req.flash('success')
            });
        });

    },

    /**
     * Show create form
     */
    showCreate: (req, res) => {
        res.render('pages/create', {
            errors: req.flash('errors')
        });
    },

    /**
     * Process create form
     */
    processCreate: (req, res) => {

        // Validate form input
        req.checkBody({
            'name': {
                notEmpty: {
                    errorMessage: 'Name is required.'
                }
            },
            'description': {
                notEmpty: {
                    errorMessage: 'Description is required.'
                }
            }
        });

        req.getValidationResult().then((result) => {

            if (!result.isEmpty()) {

                req.flash('error', result.array().map(err => err.msg));
                return res.redirect('/events/create');

            } else {

                // Create new event
                const event = new Event({
                    name: req.body.name,
                    description: req.body.description
                });

                // Save event
                event.save((err) => {
                    if (err) {
                        throw err;
                    }

                    // Set a success flash message
                    req.flash('success', 'Successfully created event!');

                    // Redirect to newly created event
                    res.redirect(`/events/${event.slug}`);
                });
            }
        });
    },

    /**
     * Show edit form
     */
    showEdit: (req, res) => {
        Event.findOne({ slug: req.params.slug }, (err, event) => {
            res.render('pages/edit', {
                event: event,
                errors: req.flash('errors')
            });
        });
    },

    /**
     * Process edit form
     */
    processEdit: (req, res) => {

        // Validate event
        req.checkBody('name', 'Name is required.').notEmpty();
        req.checkBody('description', 'Description is required.').notEmpty();

        // If there are errors, redirect and save errors to flash
        const errors = req.validationErrors();
        if (errors) {
            req.flash('error', errors.map(err => err.msg));
            return res.redirect(`/events/${req.params.slug}/edit`);
        }

        // Finding current event
        Event.findOne({ slug: req.params.slug }, (err, event) => {
            event.name = req.body.name;
            event.description = req.body.description;

            // Update event
            event.save((err) => {
                if (err) {
                    throw err;
                }

                req.flash('success', 'Successfully updated event');
                res.redirect('/events');
            });
        });
    },

    /**
     * Delete event
     */
    deleteEvent: (req, res) => {
        Event.remove({ slug: req.params.slug }, (err) => {
            req.flash('success', 'Event deleted!');
            res.redirect('/events');
        });
    }
};
