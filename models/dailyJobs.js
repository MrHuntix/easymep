let mongoose = require('mongoose');

let dailyJobSchema = new mongoose.Schema({
    job_name: { type: String, index: true },
    status: { type: String },
    start_time: { type: Date, },
    completion_time: { type: Date, },
    issues: { type: String, }
});

module.exports = mongoose.model("daily_jobs", dailyJobSchema, "daily_jobs");