const scheduler = require('node-cron');
const instance = require('../service/herokuApi');
let HerokuAuthModel = require('../models/herokuAuth');
let AppDataModel = require('../models/appData');

class MyScheduler {
    constructor() {
        this._startAppUpdateJob();
    }

    //schedules job to run every day to update apps data
    async _startAppUpdateJob() {
        scheduler.schedule("30 30 0 * * *", async () => {
            try {
                console.log(`app update job triggered at ${new Date()}`);
                let result = await HerokuAuthModel.find({}, ['access_token']).exec();
                console.log(`found ${result.length} tokens from db`);
                result.forEach(async (token) => {
                    try {
                        console.log(`token ${token.access_token}`);
                        let apps = await instance.getApps(token.access_token);
                        apps.forEach(async (app) => {
                            try {
                                console.log(`app ${app.maintenance}`);
                                let doc = await AppDataModel.find({ app_id: app.id }).exec();
                                if (doc.length > 0) {
                                    console.log(`project exists  ${doc[0].name}`);
                                    if (this._isUpdateNeeded(app, doc[0])) {
                                        console.log(`updating ${doc[0].name} ${doc[0]._id}`);
                                        let result = await AppDataModel.update(
                                            { _id: doc[0]._id },
                                            { $set: { app_meta_data: this._herokuToAppDatamapper(app).app_meta_data } },
                                            { new: true, upsert: true, useFindAndModify: false }).exec();
                                        console.log(`updated ${result}`);
                                    } else {
                                        console.log(`${doc[0].name} does not need an update.`);
                                    }
                                } else {
                                    console.log(`adding app to db`);
                                    let updateDoc = this._herokuToAppDatamapper(app);
                                    let doc = await updateDoc.save();
                                    console.log(`created ${doc._id}`);
                                }
                            } catch (error) {
                                console.log(`error while saving or updating existing project ${error.message}`);
                            }
                        });
                    } catch (error) {
                        console.log(`error while hitting heroku api ${error.message}`);
                    }
                });
                console.log(`app update job completed at ${new Date()}`);
            } catch (error) {
                console.log(`error while retreiving tokens ${error.message}`);
            } finally {
                console.log(`job completed ${Date()}`)
            }
        });
    }

    _herokuToAppDatamapper(app) {
        let newModel = new AppDataModel({
            app_id: app.id,
            name: app.name,
            owner_email: app.owner.email,
            web_url: app.web_url,
            app_meta_data: {
                maintenance: app.maintenance,
                git_url: app.git_url,
                created_at: app.created_at,
                last_build: app.updated_at,
            }
        });
        return newModel;
    }

    _isUpdateNeeded(app, doc) {
        console.log(`maintenance (${app.maintenance}, ${doc.app_meta_data.maintenance}), updated_at (${new Date(app.updated_at).toString()}, ${doc.app_meta_data.last_build})`);
        return app.maintenance != doc.app_meta_data.maintenance || new Date(app.updated_at).toString() != doc.app_meta_data.last_build;
    }
}

module.exports = new MyScheduler();