const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    timeCreated: {
        type: Date,
        required: true,
        default: Date.now
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model('User', UserSchema);