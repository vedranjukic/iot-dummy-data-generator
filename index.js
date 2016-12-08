const DeviceManager = require('./src/fake-device-manager')
const FakeDeviceConnection = require('./src/fake-device-connection')()

const updateStats = require('./src/stats')

console.log('Generating data - send interval: 15s')

let deviceManager = DeviceManager({
  deviceCount: 100,
  connection: FakeDeviceConnection,
  onUpdateStats: updateStats,
  measurements: {
    usage: {type: 'integer', min: 0, max: 100},
    voltage: {type: 'integer', min: 0, max: 15},
    temperature: {type: 'integer', min: -20, max: 60}
  }
})

updateStats(deviceManager)

deviceManager.start()
