'use strict';
const express = require('express');
const router = express.Router();
let AppModel = require('../models/app');
let jwtService = require('../service/jwtService');
let eventService = require('../service/eventService');
let SSE = require('sse-nodejs');
//router.use(jwtService.validateToken);

//get request to fetch all the apps that is being displayed in my website
router.get('/', async (req, res) => {
    try {
        let result = await AppModel.find({}, ["_id", "app_name", "description", "live_url", "git_url", "languages"]).exec();
        res.status(200).send({
            'message': `found ${result.length} apps`,
            'apps': result
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            'message': 'An error occured while retriving projects'
        });
    }
});

router.get('/delta', (req, res) => {
    console.log('delta');
    let sseProducer = SSE(res);

    sseProducer.disconnect(() => {
        eventService.removeConsumer(req.hostname);
    });
    
    eventService.addConsumer(req.hostname, sseProducer);
});

//post request to add a project that will be displayed in my website.
router.post('/', async (req, res) => {
    let app = new AppModel({
        app_name: req.body.app_name,
        languages: req.body.languages,
        description: req.body.description,
        git_url: req.body.git_url,
        live_url: req.body.live_url
    });
    try {
        let doc = await app.save();
        console.log(doc);

        //sse notify step
        await eventService.notifyConsumers(doc);

        res.status(200).send({
            'message': 'app added',
            'id': doc._id,
            'app_name': doc.app_name,
            'description': doc.description,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            'message': 'An error occured while saving project'
        });
    }
});

//put request to update an existing project
router.put('/:id', async (req, res) => {
    try {
        let doc = await AppModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();
        console.log(`updated ${doc._id}`);

        res.status(200).send({
            'message': 'project updated',
            'id': doc._id,
            'app_name': doc.app_name,
            'description': doc.description,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            'message': 'An error occured while updating project'
        });
    }
})

//delete request to delete a project
router.delete('/:id', async (req, res) => {
    try {
        let doc = await AppModel.findByIdAndDelete(req.params.id).exec();
        console.log(`deleted ${doc._id}`);

        res.status(200).send({
            'message': `${doc.app_name} deleted`
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            'message': 'An error occured while deleting project'
        });
    }
})

module.exports = router;