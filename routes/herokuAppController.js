'use strict';
const express = require('express');
const router = express.Router();
let AppDataModel = require('../models/appData');
let jwtService = require('../service/jwtService');

router.use(jwtService.validateToken);
router.get('/', async (req, res) => {
    try {
        let result = await AppDataModel.find().exec();
        res.status(200).json({
            "message": `found ${result.length} apps`,
            "apps": result
        });
    } catch (error) {
        console.error(err);
        res.send(500).json({
            'message': 'An error occured while retriving apps'
        });
    }
})

module.exports = router;