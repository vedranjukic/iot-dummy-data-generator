const influx = require('./influx')()

module.exports = function () {
  /**
   * Generates writepoints for influx bluk write operation
   */
  const getWritePoints = (deviceId, data) => {
    let writePoints = []
    //  itterate all data chunks
    data.forEach(chunk => {
      //  and for each data chunk key, create measurement and push it into writePoint (bulk-write)
      Object
      .keys(chunk)
      .filter(measurement => measurement !== 'timestamp')
      .forEach(measurement => {
        writePoints.push({
          measurement,
          tags: {
            deviceId
          },
          fields: {
            value: chunk[measurement]
          },
          timestamp: chunk['timestamp']
        })
      })
    })
    return writePoints
  }

  const send = function (deviceId, data) {
    return influx.writePoints(getWritePoints(deviceId, data))
  }
  return {
    send
  }
}
