'use strict';
const express = require('express');
const router = express.Router();
let HerokuAuthModel = require('../models/herokuAuth');
let jwtService = require('../service/jwtService');

router.use(jwtService.validateToken);
//get all tokens available
router.get('/', async (req, res) => {
    try {
        let result = await HerokuAuthModel.find().exec();
        res.status(200).json({
            "message": `found ${result.length} tokens`,
            "tokens": result
        });
    } catch (error) {
        console.error(err);
        res.send(500).json({
            'message': 'An error occured while retriving tokens'
        });
    }
});

//add a new token
router.post('/', async (req, res) => {
    try {
        let authData = new HerokuAuthModel({
            user_id: req.body.user_id,
            email: req.body.email,
            access_token_id: req.body.access_token_id,
            access_token: req.body.access_token,
            description: req.body.description,
            created_at: req.body.created_at
        });

        let doc = await authData.save();
        console.log(doc);
        res.status(200).json({
            'message': 'token added',
            'token': doc
        });
    } catch (error) {
        console.error(error);
        res.send(500).json({
            'message': 'An error occured while adding new token'
        });
    }
});

module.exports = router;