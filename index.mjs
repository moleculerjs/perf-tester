"use strict";

import { ServiceBroker } from "moleculer";

const transporter = process.env.TRANSPORTER || "Fake";
const serializer = process.env.SERIALIZER || "JSON";
const discoverer = process.env.DISCOVERER || "Local";
let duration = process.env.DURATION || null;
if (duration != null) {
	duration = Number(duration);
}

console.log("Performance tester");
console.log("==================");
console.log("");
console.log("  Transporter:", transporter);
console.log("  Serializer:", serializer);
console.log("  Discoverer:", discoverer);
if (duration)
	console.log("  Test duration:", duration, "seconds");
console.log("");

const b1 = new ServiceBroker({
	nodeID: "node-1",
	logger: true,
	transporter,
	serializer,
	discoverer
});

const b2 = new ServiceBroker({
	nodeID: "node-2",
	logger: true,
	transporter,
	serializer,
	discoverer
});

b2.createService({
	name: "echo",
	actions: {
		reply(ctx) {
			return ctx.params;
		}		
	}
});

async function start() {
	console.log("Starting brokers...");
	await b1.start();
	await b2.start();
	await b1.Promise.delay(1000);

	console.log("Brokers started.");
	console.log("Starting test...");

	let beginTime = Date.now();
	let count = 0;
	function doRequest() {
		count++;
		return b1
			.call("echo.reply", { a: count })
			.then(res => {
				if (count % 10000) {
					// Fast cycle
					doRequest();
				} else {
					// Slow cycle
					setImmediate(() => doRequest());
				}
				return res;
			})
			.catch(err => {
				throw err;
			});
	}

	setTimeout(() => {
		let startTime = Date.now();

		setInterval(() => {
			let rps = count / ((Date.now() - startTime) / 1000);
			console.log(rps.toLocaleString("en-US", { maximumFractionDigits: 0 }), "req/s");
			count = 0;
			startTime = Date.now();

			if (duration != null) {
				if (Date.now() - beginTime > duration * 1000) {
					console.log("Test finished.");
					process.exit(0);
				}
			}
		}, 1000);

		b1.waitForServices(["echo"]).then(() => doRequest());
	}, 1000);
}

start().catch(err => console.error(err));