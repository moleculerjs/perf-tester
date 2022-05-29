import { Consumer } from "./consumer.mjs";

export class Producer extends Consumer {
    constructor(opts) {
        super(opts);
        this.beginTime = null;
    }

    createServices() {
        // No services in Producer
    }

    async start() {
        await this.broker.start();

		await (new Promise(resolve => setTimeout(resolve, 1000)));

		console.log(`Broker '${this.broker.nodeID}' started.`);
		console.log("Starting test...");

		this.beginTime = Date.now();
		let count = 0;
		const doRequest = async () => {
			count++;
			await this.broker.call("echo.reply", { a: count })
            if (count % 10000) {
                // Fast cycle
                doRequest();
            } else {
                // Slow cycle
                setImmediate(() => doRequest());
            }
		}

		await this.broker.waitForServices(["echo"]);
		let startTime = Date.now();

		setInterval(() => {
			let rps = count / ((Date.now() - startTime) / 1000);
			console.log(rps.toLocaleString("en-US", { maximumFractionDigits: 0 }), "req/s");
			count = 0;
			startTime = Date.now();

			if (this.opts.duration != null) {
				if (Date.now() - this.beginTime > this.opts.duration * 1000) {
					console.log("Test finished.");
					process.exit(0);
				}
			}
		}, 1000);

		doRequest();
    }

}