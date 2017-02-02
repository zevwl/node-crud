const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema
const eventSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        unique: true
    },
    description: {
        type: String,
        required: true
    }
});

// Middleware
// Make that the slug is created from the name
eventSchema.pre('save', function (next) {
    this.slug = slugify(this.name);
    next();
});

// Create model
const eventModel = mongoose.model('Event', eventSchema);

// Export model
module.exports = eventModel;

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')       // Replace spaces with -
        .replace(/[^\w\-]+/g, '')   // Replace all non-word chars
        .replace(/\-\-+/g, '-')     // Replace multiple - with single -
        .replace(/^-+/, '')         // Trim - from start of text
        .replace(/-+$/, '');        // Trim - from end of text
}
