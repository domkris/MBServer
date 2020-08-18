const mongoose = require('mongoose');

const GameSchema = mongoose.Schema({
    timeCreated: {
        type: Date,
        required: true,
        default: Date.now
    },
    password: {
        type: String,
        required: true
    },
    createdBy: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Game', GameSchema);