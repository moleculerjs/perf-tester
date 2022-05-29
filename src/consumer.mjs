import { ServiceBroker } from "moleculer";
import _ from "lodash";
import kleur from "kleur";

export class Consumer {
	constructor(opts) {
		this.opts = opts;
		this.count = 0;
		this.createBroker();
		this.createServices();
	}

	createBroker() {
		this.broker = new ServiceBroker({
			namespace: "perf-test",
			logger: true,
			requestTimeout: 10000,
			...this.opts
		});
	}

	createServices() {
		const self = this;
		this.broker.createService({
			name: "echo",
			actions: {
				reply(ctx) {
					self.count++;
					return ctx.params;
				}
			}
		});
	}

	async start() {
		await this.broker.start();
		console.log(`Broker '${this.broker.nodeID}' started. PID: ` + process.pid);

		if (this.opts.mode) {
			setInterval(() => {
				if (this.count > 0) {
					console.log(
						kleur.grey(`[${new Date().toISOString().substr(11, 8)}]`),
						this.broker.nodeID,
						":",
						kleur.yellow(
							_.padStart(
								Number(this.count.toFixed(0)).toLocaleString("en-US", {
									maximumFractionDigits: 0
								}),
								8
							)
						),
						"req/s"
					);
					this.count = 0;
				}
			}, 1000);
		}
	}
}
