const sizeof = require('object-sizeof')
const FakeDevice = require('./fake-device')

module.exports = function FakeDeviceManager ({
  connection,
  deviceCount = 100,
  spawnInterval = 200,
  metricsInterval = 200,
  sendInterval = 15000,
  measurements,
  onStats
}) {
  if (!connection) {
    throw new Error('Missing connection param')
  }
  if (!measurements) {
    throw new Error('Missing measurements param')
  }
  let devices = []

  let stats = {
    devices: 0,
    measurements: 0,
    writes: 0,
    size: 0,
    errors: 0
  }

  /**
   * Return device list
   */
  const getDevices = () => {
    return devices
  }

  /**
   * Update stats on device data send event
   */
  const onDeviceSendData = (err, data) => {
    if (err) {
      console.log(err)
      stats.errors++
      return
    }
    stats.measurements += data.length
    data.forEach(chunk => {
      stats.size += sizeof(chunk)
    })
    stats.writes++
  }

  /**
   * Start device spawn process
   */
  const start = () => {
    let __spawnInterval = setInterval(() => {
      stats.devices++
      devices.push(FakeDevice({
        deviceId: stats.devices,
        connection,
        measurements,
        onSendData: onDeviceSendData,
        autoStart: true,
        metricsInterval,
        sendInterval
      }))
      //  when device limit is reached stop spawn inteval
      if (stats.devices === deviceCount) {
        clearTimeout(__spawnInterval)
      }
    }, spawnInterval)
    //  start stats update timer
    setInterval(() => {
      if (onStats) {
        onStats(JSON.parse(JSON.stringify(stats)))
      }
    }, 100)
  }

  /**
   * Stop all spawned devices
   */
  const stop = () => {
    for (let i = 0; i < stats.devices; i++) {
      devices[i].stop()
    }
  }

  return {
    start,
    stop,
    getDevices
  }
}
