![Moleculer logo](http://moleculer.services/images/banner.png)

# Performance Tester
It's a simple tool to test your Moleculer based project tech stack including transporter, serializer, discoverer.

## Under the hood
The test creates 2 ServiceBroker instances with a simple `echo` service which responses the received `params`.

## Usage

Run the tester with NATS transporter
```bash
docker run -e TRANSPORTER=nats://nats:4222 moleculer/perf-tester
```

### Test transporter cluster
If you would like to test transporter cluster nodes separately, you can start the test brokers individually with the `BROKER` env var.

Start the consumer
```bash
docker run -e TRANSPORTER=nats://nats-1:4222 -e MODE=consumer moleculer/perf-tester
```

Start the producer
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

## License
The project is available under the [MIT license](https://tldrlegal.com/license/mit-license).

## Contact
Copyright (c) 2022 MoleculerJS

[![@MoleculerJS](https://img.shields.io/badge/github-moleculerjs-green.svg)](https://github.com/moleculerjs) [![@MoleculerJS](https://img.shields.io/badge/twitter-MoleculerJS-blue.svg)](https://twitter.com/MoleculerJS)
