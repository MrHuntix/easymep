'use strict';
const express = require('express');
let AuthDataModel = require('../models/authData');
let jwtService = require('../service/jwtService');

const router = express.Router();

//post request for login
router.post('/login', async (req, res) => {
    try {
        let { username, password } = req.body;
        let user = await AuthDataModel.find({ 'username': username }).exec();
        if (user.length === 0) {
            res.status(401).send({
                'message': 'invalid username/password',
                'username': 'unavailable',
                'token': 'unavailable',
            });
        } else {
            if (user[0].password === password && user[0].active) {
                res.status(200).json({
                    'message': 'login successful',
                    'username': user[0].username,
                    'token': user[0].auth_token,
                });
            } else if (user[0].password != password) {
                res.status(401).send({
                    'message': 'invalid username/password',
                    'username': 'unavailable',
                    'token': 'unavailable',
                });
            }
            if (!user[0].active) {
                res.status(401).json({
                    'message': 'account blocked',
                    'username': 'unavailable',
                    'token': 'unavailable',
                });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({
            'message': 'login error',
            'username': 'unavailable',
            'token': 'unavailable',
        });
    }


});

//post request for signup
router.post('/signup', async (req, res) => {
    try {

        let { username, password, source } = req.body;
        let user = await AuthDataModel.find({ 'username': username }).exec();
        if (user.length > 0) {
            console.log(`user ${username} exists.`);
            res.status(200).send(JSON.stringify({
                'message': 'username already in use',
                'username': 'unavailable',
                'token': 'unavailable',
            }));
        } else {
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
                    'username': doc.username,
                    'token': doc.auth_token,
                }))
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(JSON.stringify({
            'message': 'signup error',
            'username': 'unavailable',
            'token': 'unavailable',
        }));
    }

});

module.exports = router;