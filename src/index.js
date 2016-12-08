const DeviceManager = require('./fake-device-manager')
const FakeDeviceConnection = require('./fake-device-connection')()

const updateStats = require('./stats')()

console.log('Generating data - send interval: 15s')

let deviceManager = DeviceManager({
  deviceCount: 100,
  connection: FakeDeviceConnection,
  onStats: updateStats,
  measurements: {
    usage: {type: 'integer', min: 0, max: 100},
    voltage: {type: 'integer', min: 0, max: 15},
    temperature: {type: 'integer', min: -20, max: 60}
  }
})

deviceManager.start()
