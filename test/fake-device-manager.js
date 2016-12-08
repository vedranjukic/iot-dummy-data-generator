/* globals describe it */

const expect = require('chai').expect

const FakeDeviceManager = require('../src/fake-device-manager')
const measurements = {
  usage: {type: 'integer', min: 0, max: 100},
  voltage: {type: 'integer', min: 0, max: 15},
  temperature: {type: 'integer', min: -20, max: 60}
}

//  create fake influx connection
//  let connectionWriteData = false
const connection = {
  send: (deviceId, data) => {
    return new Promise((resolve, reject) => {
      //  connectionWriteData = {deviceId, data}
      resolve()
    })
  }
}

let _stats = false
const onUpdateStats = function (stats) {
  _stats = stats
}

describe('FakeDeviceManager', function () {
  let fakeDeviceManager = null

  it('should throw error if no params are passed', function () {
    expect(FakeDeviceManager).to.throw(Error)
  })

  it('shold throw missing connection param', function () {
    expect(() => FakeDeviceManager({})).to.throw('Missing connection param')
  })

  it('shold throw missing measurements param', function () {
    expect(() => FakeDeviceManager({
      connection
    })).to.throw('Missing measurements param')
  })

  it('should create instance', function () {
    fakeDeviceManager = FakeDeviceManager({
      connection,
      measurements,
      onUpdateStats: onUpdateStats,
      sendInterval: 500
    })
    expect(fakeDeviceManager).to.have.property('start')
  })

  it('should spawn device instances', function (done) {
    fakeDeviceManager.start()
    setTimeout(() => {
      let devices = fakeDeviceManager.getDevices()
      done(!devices.length)
    }, 500)
  })

  it('should collect device stats', function (done) {
    setTimeout(() => {
      if (!_stats) return done('No data')
      if (
        _stats.devices &&
        _stats.measurements &&
        _stats.writes &&
        _stats.size
      ) {
        done()
      } else {
        done('Invalid write data format')
      }
    }, 1000)
  })
})
