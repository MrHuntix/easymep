let mongoose = require('mongoose');

let appDataSchema = new mongoose.Schema({
    app_id: { type: String, unique: true, index: true },
    name: { type: String },
    owner_email: { type: String },
    web_url: { type: String },
    app_meta_data: {
        maintenance: { type: Boolean },
        git_url: { type: String },
        created_at: { type: Date },
        last_build: { type: Date },
    }
});

module.exports = mongoose.model('app_data', appDataSchema, 'app_data');