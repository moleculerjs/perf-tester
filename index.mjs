"use strict";

import { Consumer } from "./src/consumer.mjs";
import { Producer } from "./src/producer.mjs";

const transporter = process.env.TRANSPORTER || "Fake";
const serializer = process.env.SERIALIZER || "JSON";
const discoverer = process.env.DISCOVERER || "Local";
let duration = process.env.DURATION || null;
if (duration != null) {
	duration = Number(duration);
}
const mode = process.env.MODE;
let nodeID = process.env.NODE_ID;

console.log("Performance tester");
console.log("==================");
console.log("");
console.log("  Transporter:", transporter);
console.log("  Serializer:", serializer);
console.log("  Discoverer:", discoverer);
if (duration) console.log("  Test duration:", duration, "seconds");
if (mode) console.log("  Mode:", mode);
if (nodeID) console.log("  Node ID:", nodeID);

console.log("");

let consumer, producer;

if (!mode || mode == "producer") {
	producer = new Producer({
		transporter,
		serializer,
		registry: {
			discoverer
		},
		nodeID: !mode ? `producer-${nodeID || process.pid}` : nodeID,
		mode,
		duration
	});
}

if (!mode || mode == "consumer") {
	consumer = new Consumer({
		transporter,
		serializer,
		discoverer,
		nodeID: !mode ? `consumer-${nodeID || process.pid}` : nodeID,
		mode,
		duration
	});
}

async function start() {
	if (consumer) await consumer.start();
	if (producer) await producer.start();
}

start().catch(err => console.error(err));
