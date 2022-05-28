![Moleculer logo](http://moleculer.services/images/banner.png)

# Performance Tester
It's a simple tool to test your Moleculer based project tech stack including transporter, serializer, discoverer.

## Under the hood
The test creates 2 ServiceBroker instances (producer and consumer) with a simple `echo` service which responses the received `params`. The producer calls the `echo` service and waits for the response one-by-one continuously.

> You can start the consumer and producer brokers separately (`MODE` env var) in order to test transporter cluster, or generate more request with multiple consumers and/or producers.

## Usage

Run the tester with NATS transporter
```bash
docker run -e TRANSPORTER=nats://demo.nats.io:4222 moleculer/perf-tester
```

### Test transporter cluster
If you would like to test transporter cluster nodes separately, you can start the test brokers individually with the `MODE` env var.

**Start the consumer**
```bash
docker run -e TRANSPORTER=nats://nats-1:4222 -e MODE=consumer moleculer/perf-tester
```

**Start the producer**
```bash
docker run -e TRANSPORTER=nats://nats-2:4222 -e MODE=producer moleculer/perf-tester
```


### Available environment variables

| Variable | Example value | Description |
| -------- | ------------- | ----------- |
| `TRANSPORTER` | `NATS` or `redis://redis:6379` | Transporter connection string or name. |
| `SERIALIZER` | `JSON` | Serializer name. |
| `DISCOVERER` | `Local` | Discoverer name. |
| `DURATION` | `5` | Test duration in seconds. If `null`, the test is running infinity. |
| `MODE` | `consumer`, `producer`, `null` | Test mode. |
| `NODE_ID` | `consumer-123` | Custom nodeID. Use only in `consumer` or `producer` mode if you want custom nodeID for brokers. Otherwise `ServiceBroker` generates from hostname and PID. |

## License
The project is available under the [MIT license](https://tldrlegal.com/license/mit-license).

## Contact
Copyright (c) 2022 MoleculerJS

[![@MoleculerJS](https://img.shields.io/badge/github-moleculerjs-green.svg)](https://github.com/moleculerjs) [![@MoleculerJS](https://img.shields.io/badge/twitter-MoleculerJS-blue.svg)](https://twitter.com/MoleculerJS)
