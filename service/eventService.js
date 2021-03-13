class EventService {
    constructor() {
        console.log('setting up event service');
        this._consumers = new Map();
    }


    addConsumer(client, producer) {
        if (!this._consumers.has(client)) {
            console.log(`added host:  ${client}`);
            this._consumers.set(client, producer);
        }
        console.log(`there are ${this._consumers.size} connections`);
    }

    removeConsumer(hostname) {
        console.log(`removing client ${hostname}`);
        this._consumers.delete(hostname);
    }

    async notifyConsumers(data) {
        if (this._consumers.size > 0) {
            this._consumers.forEach((producer, client) => {
                try {
                    console.log(`sending to client: ${client}`);
                    const sseFormattedResponse = this.constructData(data.app_name, data.description, data.languages, data.git_url, data.live_url);
                    console.log(`message: ${sseFormattedResponse}`);
                    producer.send(sseFormattedResponse);
                } catch (error) {
                    console.log(`error while sending sse message ${error.message}`);
                }

            });
        }
    }

    constructData(app_name, description, languages, git_url, live_url) {
        return `{"app_name": "${app_name}", "description": "${description}", "languages": "${languages}", "git_url": "${git_url}", "live_url": "${live_url}"}\n\n`;
    }
}

module.exports = new EventService();