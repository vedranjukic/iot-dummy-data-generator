/* globals describe it */

const expect = require('chai').expect

const FakeDevice = require('../src/fake-device')
const measurements = {
  usage: {type: 'integer', min: 0, max: 100},
  voltage: {type: 'integer', min: 0, max: 15},
  temperature: {type: 'integer', min: -20, max: 60}
}

//  create fake influx connection
let connectionWriteData = false
const connection = {
  send: (deviceId, data) => {
    return new Promise((resolve, reject) => {
      connectionWriteData = {deviceId, data}
      resolve()
    })
  }
}

describe('FakeDevice', function () {
  let fakeDevice = null

  it('should throw error if no params are passed', function () {
    expect(FakeDevice).to.throw(Error)
  })

  it('shold throw missing deviceId param', function () {
    expect(() => FakeDevice({})).to.throw('Missing deviceId param')
  })

  it('shold throw missing connection param', function () {
    expect(() => FakeDevice({
      deviceId: 1
    })).to.throw('Missing connection param')
  })

  it('shold throw missing measurements param', function () {
    expect(() => FakeDevice({
      deviceId: 1,
      connection
    })).to.throw('Missing measurements param')
  })

  it('should create instance', function () {
    fakeDevice = FakeDevice({
      deviceId: 1,
      connection,
      sendInterval: 1000,
      measurements
    })
    expect(fakeDevice).to.have.property('start')
  })

  it('should generate data', function (done) {
    fakeDevice.start()
    setTimeout(() => {
      let data = fakeDevice.getData()
      done(!data.length)
    }, 500)
  })

  it('should send data to influx', function (done) {
    setTimeout(() => {
      if (!connectionWriteData) return done('No data')
      if (!connectionWriteData.deviceId) return done('Invalid write data - missing deviceId')
      if (
        connectionWriteData.data[0].usage &&
        connectionWriteData.data[0].voltage &&
        connectionWriteData.data[0].temperature &&
        connectionWriteData.data[0].timestamp
      ) {
        done()
      } else {
        done('Invalid write data format')
      }
    }, 1000)
  })
})
