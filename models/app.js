let mongoose = require('mongoose');

let appSchema = new mongoose.Schema({
    app_name: { type: String, unique: true },
    languages: { type: Array },
    description: { type: String },
    git_url: { type: String },
    live_url: { type: String }
});

module.exports = mongoose.model('app', appSchema, 'app');