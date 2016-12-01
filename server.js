// Load environment variables
require('dotenv').config();

// Dependencies
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const expressValidator = require('express-validator');


// Configure application
// Set sessions and cookie parser
app.use(cookieParser());
app.use(session({
    secret: process.env.SECRET,
    cookie: { maxAge: 60000 },
    resave: false,  // forces the session to be saved back to the store
    saveUninitialized: false    // don't save unmodified sessions
}));
app.use(flash());

// Tell express where to look for static assets
app.use(express.static(__dirname + '/public'));

// Set EJS as our template engine
app.set('view engine', 'ejs');
app.use(expressLayouts);

// Connect to database
mongoose.connect(process.env.DB_URI);

// Use body parser to grab info from a form
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

// Set routes
app.use(require('./app/routes'));

// Start server
app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
});