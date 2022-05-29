import { ServiceBroker } from "moleculer";

export class Consumer {

    constructor(opts) {
        this.opts = opts;
        this.createBroker();
        this.createServices();
    }

    createBroker() {
        this.broker = new ServiceBroker({
            namespace: "perf-test",
            logger: true,
            ...this.opts,
        }); 
    }

    createServices() {
        this.broker.createService({
            name: "echo",
            actions: {
                reply(ctx) {
                    return ctx.params;
                }
            }
        });        
    }

    async start() {
        await this.broker.start();

		console.log(`Broker '${this.broker.nodeID}' started.`);
    }

}