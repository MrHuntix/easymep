'use strict';
const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require('body-parser');
const clientAppController = require('./routes/clientAppController');
const herokuAppController = require('./routes/herokuAppController');
const herokuAuthController = require('./routes/herokuAuthController');
const AuthController = require('./routes/authController');

//initialises jobs
const Scheduler = require('./jobs/appDataJob');

console.log(process.env.SUCCESS);
const app = express();
const port = process.env.PORT || 3100;
const db = require('./configurations/datasource');

//body parser
app.use(bodyParser.json());
//morgan fpr logging
app.use(morgan('combined'));
//routers
app.use('/client', clientAppController);
app.use('/apps', herokuAppController);
app.use('/heroku/auth', herokuAuthController);
app.use('/auth', AuthController);

app.listen(port, () => {
    console.log(`app running on port ${port}`);
})