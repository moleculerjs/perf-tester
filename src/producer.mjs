import { Consumer } from "./consumer.mjs";
import _ from "lodash";
import kleur from "kleur";
import humanize from "tiny-human-time";

export class Producer extends Consumer {
	constructor(opts) {
		super(opts);
		this.beginTime = null;

		this.counter = 0;
		this.callCount = 0;
		this.errorCount = 0;
		this.totalErrorCount = 0;
		this.sumTime = 0;
		this.maxTime = null;

		this.flood = process.env.FLOOD || 0;
	}

	createServices() {
		// No services in Producer
	}

	color(text, pad, value, green, red) {
		let c;
		if (value <= green) c = kleur.green().bold;
		else if (value >= red) c = kleur.red().bold;
		else c = kleur.yellow().bold;
		return c(_.padStart(text, pad));
	}

	work() {
		const startTime = process.hrtime();
		this.counter++;
		let payload = { c: this.counter };
		const p = this.broker
			.call("echo.reply", payload)
			.then(() => {
				this.callCount++;

				const diff = process.hrtime(startTime);
				const dur = (diff[0] + diff[1] / 1e9) * 1000;
				this.sumTime += dur;
				if (this.maxTime == null || this.maxTime < dur) this.maxTime = dur;
			})
			.catch(() => {
				//console.warn(err.message, " Counter:", payload.c);
				this.errorCount++;
				this.totalErrorCount++;
			});

		// Overload
		if (this.flood > 0 && this.broker.transit.pendingRequests.size < this.flood)
			setImmediate(() => this.work());
		else p.finally(() => setImmediate(() => this.work()));
	}

	async start() {
		await this.broker.start();

		await new Promise(resolve => setTimeout(resolve, 1000));

		console.log(`Broker '${this.broker.nodeID}' started.`);
		console.log("Starting test...");

		await this.broker.waitForServices(["echo"]);

		let startTime = Date.now();
		this.beginTime = Date.now();

		setInterval(() => {
			if (this.callCount > 0) {
				let rps = this.callCount / ((Date.now() - startTime) / 1000);

				let queueSize = this.broker.transit.pendingRequests.size;
				let latency = this.sumTime / this.callCount;

				console.log(
					this.broker.nodeID,
					":",
					_.padStart(Number(rps.toFixed(0)).toLocaleString(), 8),
					"req/s",
					"  P:",
					this.color(
						Number(queueSize.toFixed(0)).toLocaleString(),
						5,
						queueSize,
						100,
						this.flood ? this.flood * 0.8 : 100
					),
					"  E:",
					this.color(
						Number(this.errorCount.toFixed(0)).toLocaleString(),
						5,
						this.errorCount,
						0,
						1
					),
					"  TE:",
					this.color(
						Number(this.totalErrorCount.toFixed(0)).toLocaleString(),
						5,
						this.totalErrorCount,
						0,
						1
					),
					"  L:",
					this.color(humanize.short(latency), 6, latency, 500, 5000),
					"  ML:",
					this.color(humanize.short(this.maxTime), 6, this.maxTime, 1000, 5000)
				);
				this.callCount = 0;
				this.sumTime = 0;
				this.maxTime = 0;
				this.errorCount = 0;
				startTime = Date.now();

				if (this.opts.duration != null) {
					if (Date.now() - this.beginTime > this.opts.duration * 1000) {
						console.log("Test finished.");
						process.exit(0);
					}
				}
			}
		}, 1000);

		this.work();
	}
}
