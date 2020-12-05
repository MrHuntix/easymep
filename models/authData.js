let mongoose = require('mongoose');

let authDataSchema = new mongoose.Schema({
    username: { type: String, index: true, unique: true },
    password: { type: String },
    auth_token: { type: String },
    active: { type: Boolean },
    created_at: { type: Date },
    source: { type: String },
});

module.exports = mongoose.model('my_auth', authDataSchema, 'my_auth');