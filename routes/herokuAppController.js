'use strict';
const express = require('express');
const router = express.Router();
let AppDataModel = require('../models/appData');
let jwtService = require('../service/jwtService');
const instance = require('../service/herokuApi');

router.use(jwtService.validateToken);

router.get('/', async (req, res) => {
    try {
        let result = await AppDataModel.find({}, ["_id", "app_id", "name"]).exec();
        res.status(200).send({
            "message": `found ${result.length} apps`,
            "apps": result
        });
    } catch (error) {
        console.error(err);
        res.status(500).send({
            'message': 'An error occured while retriving apps',
            "apps": "no apps present"
        });
    }
});

router.get('/restart/:app_id', async (req, res) => {
    try {
        let app_id = req.params.app_id;
        console.log(`restarting ${app_id}`);
        let result = await instance.getDynoAndRestart(app_id);
        res.status(200).send({
            'message': result
        })
    } catch (error) {
        console.error('cnt:' + error.message);
        res.status(500).send({
            'message': error.message
        });
    }
});

module.exports = router;