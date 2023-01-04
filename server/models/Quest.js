const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const questSchema = new Schema({
    dateTime: {
        type: Date,
        required: true,
        get: (timestamp) => dateFormat(timestamp),
    },
    poster: {
        type: String,
        required: true,
        trim: true,
    },
    questTitle: {
        type: String,
        required: true,
        trim: true,
    },
    questDescription: {
        type: String,
        required: true,
        trim: true,
    },
    partySize: {
        type: Number,
        required: true,
        default: 2,
    },
    questLocation: {
        type: String,
        required: true,
        trim: true,
    },
    questPostDate: {
        type: Date,
        default: Date.now,
        get: (timestamp) => dateFormat(timestamp),
    },
    comments: [{
        commentText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280,
        },
        commentAuthor: {
            type: String,
            required: true,
            trim: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (timestamp) => dateFormat(timestamp),
        },
    }]
});

const Quest = model('Quest', questSchema);
module.exports = Quest;