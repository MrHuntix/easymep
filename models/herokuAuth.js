let mongoose = require('mongoose');

let herokuAuthSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    access_token_id: { type: String, required: true, unique: true },
    access_token: { type: String, required: true, unique: true },
    description: { type: String },
    created_at: { type: Date }
});

module.exports = mongoose.model('heroku_auth', herokuAuthSchema, 'heroku_auth');