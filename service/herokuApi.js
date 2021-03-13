let axios = require('axios').default;
let AppDataModel = require('../models/appData');
let HerokuAuthModel = require('../models/herokuAuth');

class HerokuApiService {
    constructor() {
        console.log(`created heroku api service.`);
    }

    async getApps(token) {
        try {
            var config = {
                method: 'get',
                url: 'https://api.heroku.com/apps/',
                headers: {
                    'Accept': 'application/vnd.heroku+json; version=3',
                    'Authorization': `Bearer ${token}`
                }
            };
            let response = await axios(config);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }

    async getDynoAndRestart(app_id) {
        try {
            let app = await AppDataModel.find({ 'app_id': app_id }, ["owner_email"]).exec();
            if (app.length > 0) {
                let emailId = app[0].owner_email;
                let auth = await HerokuAuthModel.find({ 'email': emailId }, ['access_token']).exec();
                if (auth.length > 0) {
                    let token = auth[0].access_token;
                    console.log(`token fetched for ${emailId}`);
                    var config = {
                        method: 'get',
                        url: `https://api.heroku.com/apps/${app_id}/dynos/`,
                        headers: {
                            'Accept': 'application/vnd.heroku+json; version=3',
                            'Authorization': `Bearer ${token}`
                        }
                    };
                    let dyno = await axios(config);
                    let dyno_id = dyno.data[0].id;
                    console.log(`app id ${app_id} and dynamo id ${dyno_id}`);
                    config.url = `https://api.heroku.com/apps/${app_id}/dynos/${dyno_id}/`;
                    config.method = 'delete';
                    let response = await axios(config);
                    if (response.status === 202) {
                        return `${response.statusText}`;
                    } else {
                        return `${response.statusText}`;
                    }
                } else {
                    return 'owner does not exist';
                }
            } else {
                return 'app not found';
            }
        } catch (error) {
            console.log(`error ${error.message}`);
            throw new Error(error.message);
        }
    }
}

module.exports = new HerokuApiService();