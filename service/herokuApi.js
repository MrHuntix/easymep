let axios = require('axios').default;

class HerokuApiService {
    constructor() {
        console.log(`created heroku api service.`);
    }

    async getApps(token) {
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
    } catch(error) {
        console.log(error);
    }
}

module.exports = new HerokuApiService();