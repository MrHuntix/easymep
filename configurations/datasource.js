let mongoose = require('mongoose');

const dbName = process.env.DB_NAME;
const dbHost = process.env.DB_HOST;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const dbAdditionalParams = process.env.DB_ADDITIONAL_PARAMS;
const uri = `mongodb+srv://${dbUsername}:${dbPassword}@${dbHost}/${dbName}?${dbAdditionalParams}`;

class Database {
    constructor() {
        console.log('initiating db connection');
        this._connect()
    }

    _connect() {
        mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
            .then(() => {
                console.log('Database connection successful')
            })
            .catch(err => {
                console.error(`Database connection error ${err}`)
            })
    }
}

module.exports = new Database()