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
        // console.log(`${user[0].password} ${user} res ${password}`);
        if (user.password === password) {
            res.status(200).json({
                'message': 'login successful',
                'username': user[0].username,
                'token': user[0].auth_token,
            });
        }
        else if (!user.active) {
            res.status(401).json({
                'message': 'account blocked'
            });
        }
        else {
            res.status(401).send({
                'message': 'invalid username/password'
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).send({
            'message': 'login error'
        });
    }


});

//post request for signup
router.post('/signup', async (req, res) => {
    try {

        let { username, password, source } = req.body;
        let user = await AuthDataModel.find({ 'username': username }).exec();
        if (user.username === username) {
            res.status(200).send({
                'message': 'username exists'
            });
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
        res.status(500).send({
            'message': 'signup error'
        });
    }

});

module.exports = router;