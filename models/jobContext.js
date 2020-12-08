class JobContext {
    constructor(jobId) {
        this._jobid = jobId;
        this._errors = [];
        this._startTime = Date();
    }
}

module.exports = JobContext;