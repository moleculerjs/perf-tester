![Moleculer logo](http://moleculer.services/images/banner.png)

# Performance Tester
It's a tool to test your Moleculer based project tech stack including transporter, serializer, discoverer.

## Under the hood
The test creates 2 ServiceBroker instances (producer and consumer) with a simple `echo` service which responses the received `params`. The producer calls the `echo` service and waits for the response one-by-one continuously (measuring the latency).

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

### Throughput measurement
The test (by default) measures the latency of action calls. It means, the producer makes an action call and wait the response. If the response is received, it will send the next request.

If you would like to measure the throughput of the system, set the `FLOOD` env var (greater than zero) to control the number of parallel pending action calls (max-in-flight).


### Available environment variables

| Variable | Example value | Description |
| -------- | ------------- | ----------- |
| `TRANSPORTER` | `NATS` or `redis://redis:6379` | Transporter connection string or name. Supports all built-in transporters. |
| `SERIALIZER` | `JSON` | Serializer name. Supports all built-in serializers. |
| `DISCOVERER` | `Local` | Discoverer name. Supports all built-in discovers. |
| `DURATION` | `5` | Test duration in seconds. If `null`, the test is running infinity. |
| `MODE` | `consumer`, `producer`, `null` | Test mode. |
| `NODE_ID` | `consumer-123` | Custom nodeID. Use only in `consumer` or `producer` mode if you want custom nodeID for brokers. Otherwise `ServiceBroker` generates from hostname and PID. |
| `FLOOD` | `0`, `1000` | Number of simultaneously requests. `0` - measures the latency, if greater than `0`, measures the throughput |

## Outputs

### Producer console messages

```
icebob-pc-3376 :      655 req/s   P: 1,000   E:     0   TE:     0   L:     1s   ML:     1s
icebob-pc-3376 :      781 req/s   P:   219   E:     0   TE:     0   L:  851ms   ML:     1s
icebob-pc-3376 :      792 req/s   P:   427   E:     0   TE:     0   L:  790ms   ML:     1s
icebob-pc-3376 :      916 req/s   P:   512   E:     0   TE:     0   L:  750ms   ML:     1s
icebob-pc-3376 :    1,138 req/s   P:   374   E:     0   TE:     0   L:  692ms   ML:  973ms
icebob-pc-3376 :    1,223 req/s   P:   152   E:     0   TE:     0   L:  665ms   ML:  902ms
icebob-pc-3376 :      826 req/s   P:   326   E:     0   TE:     0   L:  677ms   ML:  903ms
icebob-pc-3376 :      963 req/s   P:   364   E:     0   TE:     0   L:  744ms   ML:     1s
icebob-pc-3376 :    1,146 req/s   P:   218   E:     0   TE:     0   L:  696ms   ML:     1s
icebob-pc-3376 :    1,154 req/s   P:    64   E:     0   TE:     0   L:  664ms   ML:  909ms
icebob-pc-3376 :    1,064 req/s   P: 1,000   E:     0   TE:     0   L:  652ms   ML:  891ms
icebob-pc-3376 :    1,000 req/s   P: 1,000   E:     0   TE:     0   L:  624ms   ML:  861ms
icebob-pc-3376 :      959 req/s   P:    41   E:     0   TE:     0   L:  758ms   ML:     1s
icebob-pc-3376 :       41 req/s   P: 1,000   E:     0   TE:     0   L:     1s   ML:     1s
icebob-pc-3376 :      524 req/s   P:   476   E:     0   TE:     0   L:  926ms   ML:     1s
icebob-pc-3376 :      539 req/s   P:   937   E:     0   TE:     0   L:     1s   ML:     1s
icebob-pc-3376 :      937 req/s   P: 1,000   E:     0   TE:     0   L:  928ms   ML:     1s
icebob-pc-3376 :    1,000 req/s   P: 1,000   E:     0   TE:     0   L:  851ms   ML:     1s
icebob-pc-3376 :      954 req/s   P:    46   E:     0   TE:     0   L:  768ms   ML:     1s
icebob-pc-3376 :    1,018 req/s   P:    28   E:     0   TE:     0   L:  678ms   ML:     1s
icebob-pc-3376 :    1,029 req/s   P:   409   E:     0   TE:     0   L:  695ms   ML:  975ms
```

#### Legend

- `P` - number of pending requests
- `E` - number of errors (in a sec)
- `TE` - number of total errors
- `L` - Average latency
- `ML` - Maximum latency

### Consumer console messages

It prints the handled requests per second and current time.

```
[14:23:57] icebob-pc-3067 :    1,000 req/s
[14:23:58] icebob-pc-3067 :    1,000 req/s
[14:23:59] icebob-pc-3067 :    1,053 req/s
[14:24:00] icebob-pc-3067 :    1,121 req/s
[14:24:01] icebob-pc-3067 :    1,100 req/s
[14:24:02] icebob-pc-3067 :    1,060 req/s
[14:24:03] icebob-pc-3067 :    1,092 req/s
[14:24:04] icebob-pc-3067 :      836 req/s
[14:24:05] icebob-pc-3067 :    1,129 req/s
[14:24:06] icebob-pc-3067 :    1,239 req/s
[14:24:07] icebob-pc-3067 :    1,093 req/s
[14:24:08] icebob-pc-3067 :      946 req/s
[14:24:09] icebob-pc-3067 :      957 req/s
[14:24:10] icebob-pc-3067 :    1,139 req/s
[14:24:11] icebob-pc-3067 :    1,180 req/s
[14:24:12] icebob-pc-3067 :    1,055 req/s
[14:24:13] icebob-pc-3067 :    1,000 req/s
```

## License
The project is available under the [MIT license](https://tldrlegal.com/license/mit-license).

## Contact
Copyright (c) 2022 MoleculerJS

[![@MoleculerJS](https://img.shields.io/badge/github-moleculerjs-green.svg)](https://github.com/moleculerjs) [![@MoleculerJS](https://img.shields.io/badge/twitter-MoleculerJS-blue.svg)](https://twitter.com/MoleculerJS)
