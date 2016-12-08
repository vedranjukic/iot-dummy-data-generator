const Influx = require('influx')

module.exports = function init () {
  const influx = new Influx.InfluxDB({
    host: process.env.INFLUX_HOST || 'localhost',
    database: process.env.INFLUX_DATABASE || 'dummy-data',
    schema: [
      {
        measurement: 'usage',
        fields: {
          value: Influx.FieldType.INTEGER
        },
        tags: [
          'deviceId'
        ]
      },
      {
        measurement: 'voltage',
        fields: {
          value: Influx.FieldType.INTEGER
        },
        tags: [
          'deviceId'
        ]
      },
      {
        measurement: 'temperature',
        fields: {
          value: Influx.FieldType.INTEGER
        },
        tags: [
          'deviceId'
        ]
      }
    ]
  })
  return influx
}

