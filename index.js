'use strict';
const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config();
const fs = require('fs');
const bodyParser = require('body-parser');
const https = require('https');
var path = require('path');

const clientAppController = require('./routes/clientAppController');
const herokuAppController = require('./routes/herokuAppController');
const herokuAuthController = require('./routes/herokuAuthController');
const AuthController = require('./routes/authController');

//initialises jobs
const Scheduler = require('./jobs/appDataJob');

console.log(process.env.SUCCESS);
console.log(`starting application`)
const app = express();
const port = process.env.PORT || 3100;
const db = require('./configurations/datasource');

//body parser
app.use(bodyParser.json());

//morgan fpr logging
app.use(morgan('combined'));
app.use(express.static(`${__dirname}${process.env.STATIC_PATH}`));

//home page
app.get('/', (req, res) => {
    console.log(`dirname: ${__dirname}`);
    res.sendFile(path.join(`${__dirname}${process.env.HOME_PATH}`));
});

//routers
app.use('/client', clientAppController);
app.use('/apps', herokuAppController);
app.use('/heroku/auth', herokuAuthController);
app.use('/auth', AuthController);

if (process.env.HTTPS_FLAG === "http") {
    app.listen(port, () => {
        console.log(`app running on port ${port} and protocol http`);
    });
} else {
    https.createServer({
        key: fs.readFileSync(process.env.HTTPS_KEY),
        cert: fs.readFileSync(process.env.HTTPS_CERT)
    }, app).listen(port, () => {
        console.log(`app running on port ${port} and protocol https`);
    });
}