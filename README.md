# IoT Dummy Data Generator

Spawn dummy IoT devices and generate custom data that can be send to some data store.

  - Test data store performance
  - Generate dummy data to play with
  - Simulate real-time usage

## Installation

IoT Dummy Data Generator requires [Node.js](https://nodejs.org/) v6+ to run.

Requires docker to run example code.

To run example, install the dependencies and devDependencies and start project with docker-compose.

```sh
$ npm install -d
$ docker-compose up -d
```

This will create InfluxDB, Chronograf and IoT Dummy Data Generator containers

Enter IoT Dummy Data Generator container

```docker exec -ti influxdbtest_iot-ddg_1 bash
```

And start the generator

```node index.js
```

Open browser to

http://localhost:8086

and use Chronograf UI to visualize generated data.

## Usage

    const FakeDeviceManager = require('./src/fake-device-manager')
    const FakeDeviceConnection = require('./src/fake-device-connection')
    
    const connection = FakeDeviceConnection()
    
    const deviceManager = FakeDeviceManager({
      deviceCount: 100,
      metricsInterval: 30,
      connection: FakeDeviceConnection,
      onUpdateStats: updateStats,
      measurements: {
        usage: {type: 'integer', min: 0, max: 100},
        voltage: {type: 'integer', min: 0, max: 15},
        temperature: {type: 'integer', min: -20, max: 60}
      }
    })
    deviceManager.start()
    console.log('Generating data')

## API Reference

### FakeDeviceManager

Use FakeDeviceManager to spawn multiple FakeDevice instances with the same behavior. Multiple manager instances can be used in parallel to create multiple FakeDevice groups with different behavior.

When invoking FakeDeviceManager instance, you can set the following options:

* `connection`: Data store connection. (Use FakeDeviceConnection that write to Influx database to start with)
* `deviceCount`: Number of FakeDevice instances that will be spawned. (Default: `100`)
* `spawnInterval`: Number of milliseconds to wait until new FakeDevice instance is spawned. (Default: `200`)
* `metricsInterval`: Metrics interval in ms to pass to each spawned instance. (Default: `200`)
* `sendInterval`: Send interval in ms to pass to each spawned instance. (Default: `15000`)
* `measurements`: Measurements array to pass to each spawned instance.

Methods

* `start`: Start spawning FakeDevice instances
* `stop`: Stop all spawned instances
* `getDevices`: Get device list array
* `getStats`: Get stats object
 
### FakeDevice

Immitates the behaviour of real IoT device. Generates defined measurements in specified interval and submits data to data source.
Used by FakeDeviceManager, but can also be invoked as stand alone instance.

When invoking FakeDevice instance, you can set the following options:

* `deviceId`: Device identifier. Usually unique integer or string value.
* `connection`: Data store connection. (Use FakeDeviceConnection that write to Influx database to start with)
* `metricsInterval`: Metrics interval in ms to pass to each spawned instance. (Default: `200`)
* `sendInterval`: Send interval in ms to pass to each spawned instance. (Default: `15000`)
* `measurements`: Measurements array to pass to each spawned instance.
* `autoStart`: If set to true, instance will start immediately. (Default: `false`)
* `onSendData`: Function to be invoked after each send data interval.

Methods

* `start`: Start spawning FakeDevice instances
* `stop`: Stop all spawned instances
* `send`: Send data to data store
* `getData`: Get data buffer

## Todos

 - Write Todo list :)

License
----

MIT