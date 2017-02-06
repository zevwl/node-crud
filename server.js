// Load environment variables
if (process.env.NODE_ENV !== 'production') require('dotenv').config();

// Dependencies
const bodyParser = require('body-parser');
const chalk = require('chalk'); // Color console output (https://github.com/chalk/chalk/blob/master/readme.md)
const cookieParser = require('cookie-parser');
// TODO: Change connect-flash to express-flash
const express = require('express');
const expressValidator = require('express-validator');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const https = require('./private-modules/redirect-to-https');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const util = require('util');


const app = express();
const port = process.env.PORT || 8080;

module.exports = { passport };

require('./config/passport');

// Change mongoose default promise library to ES2015 promise library
mongoose.Promise = global.Promise;
// Connect to database
mongoose.connect(process.env.DB_URI);

// Configure application middleware

// Set sessions and cookie parser
app.use(cookieParser());
app.use(session({
    secret: process.env.SECRET,
    cookie: { maxAge: 60000 },
    resave: false,  // Forces the session to be saved back to the store
    saveUninitialized: false    // Don't save unmodified sessions
}));

// Session messages
app.use(flash());

// Redirect https to https
app.use(https);

// Server logs
app.use(morgan('dev'));

// Tell express where to look for static assets
app.use(express.static('public'));

// Set EJS as our template engine
app.set('view engine', 'ejs');
app.use(expressLayouts);

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

// This will run on every request
app.use((req, res, next) => {

    // Make isAuthenticated available in every request
    res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.req = req;

    res.locals.errorMessage = req.flash('error');
    res.locals.successMessage = req.flash('success');

    next();
});


// Use body parser to grab info from a form
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

// Routes
app.use('/', require('./app/routes'));


// Start server
app.listen(port, () => {
    util.log(`App listening on port ${chalk.cyan(port)}`);
});
