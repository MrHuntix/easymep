'use strict';
const express = require('express');
let AuthDataModel = require('../models/authData');
let jwtService = require('../service/jwtService');

const router = express.Router();

//post request for login
router.post('/login', async (req, res) => {
    try {
        let { username, password, token } = req.body;
        let user = await AuthDataModel.find({ 'username': username }).exec();
        // console.log(`${user[0].password} ${user} res ${password}`);
        if (user[0].password === password) {
            res.status(200).json({
                'username': username,
            });
        } else {
            res.status(401).json({
                'message': 'invalid username/password'
            });
        }

    } catch (error) {
        console.error(error);
        res.send(500).json({
            'message': 'login error'
        });
    }


});

//post request for signup
router.post('/signup', async (req, res) => {
    try {

        let { username, password, source } = req.body;
        if (username && password) {
            let token = await jwtService.createToken(username);
            let user = new AuthDataModel({
                username: username,
                password: password,
                auth_token: token,
                active: true,
                created_at: new Date(),
                source: source,
            });
            console.log('token generated. Saving user');
            let doc = await user.save();
            res.status(200).send(JSON.stringify({
                'message': 'signup successful',
                'doc': doc
            }))
        }
    } catch (error) {
        console.error(error);
        res.send(500).json({
            'message': 'signup error'
        });
    }

});

module.exports = router;