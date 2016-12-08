/**
 * Create FakeDevice
 *
 * @param {any} {
 *   deviceId,
 *   metricsInterval = 100,
 *   sendInterval = 15000
 * }
 * @returns FakeDevice
 */
module.exports = function FakeDevice ({
  deviceId,
  connection,
  metricsInterval = 100,
  sendInterval = 15000,
  onSendData,
  autoStart = false,
  measurements
}) {
  if (!deviceId) {
    throw new Error('Missing deviceId param')
  }
  if (!connection) {
    throw new Error('Missing connection param')
  }
  if (!measurements) {
    throw new Error('Missing measurements param')
  }

  let data = []

  let __metricsInterval = null
  let __sendInterval = null

  /**
   * Return data buffer
   */
  const getData = () => {
    return data
  }

  /**
   * Read data from sensors
   * Will generate fake random data
   */
  const readData = () => {
    function getRandomArbitrary (min, max) {
      return Math.random() * (max - min) + min
    }

    let chunk = {}
    Object.keys(measurements).forEach(measurement => {
      switch (measurements[measurement].type) {
        case 'integer':
          chunk[measurement] = getRandomArbitrary(measurements[measurement].min, measurements[measurement].max)
          break
        default:
          throw new Error('Invalid measurement type')
      }
    })
    chunk['timestamp'] = new Date()

    data.push(chunk)
  }

  /**
   * Send data to db and clear data buffer
   * Calls onSendData function if set
   */
  const send = () => {
    //  send data buffer to connection
    connection.send(deviceId, data)
    .then(() => {
      if (!onSendData) return
      onSendData(null, data)
      //  clear internal data buffer on successfull send
      data = []
    })
    .catch(err => {
      if (!onSendData) return
      onSendData(err)
    })
  }

  /**
   * Stop collecting data
   */
  const stop = () => {
    clearInterval(__metricsInterval)
    clearInterval(__sendInterval)
  }

  /**
   * Start collecting data
   */
  const start = () => {
    __metricsInterval = setInterval(readData, metricsInterval)
    __sendInterval = setInterval(send, sendInterval)
  }

  if (autoStart) {
    start()
  }

  return {
    stop,
    start,
    send,
    getData
  }
}
