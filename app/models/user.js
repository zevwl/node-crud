const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const userSchema = new Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAllowed: {
        type: Boolean,
        default: false
    },
    isAdmin: Boolean,
    date_created: Date,
    date_modified: Date
});

// Run this on every save
userSchema.pre('save', function (next)  {

    // Get current date
    const currentDate = new Date();

    this.date_modified = currentDate;

    if (!this.date_created) {
        this.date_created = currentDate;
    }

    next();
});

// If user is admin, he is definitely allowed...
userSchema.pre('save', function (next) {
    if (this.isAdmin && !this.isAllowed) {
        this.isAllowed = true;
    }
    next();
});

// Methods
// Generate a hash
userSchema.methods.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Check if password is valid
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
