const ProgressBar = require('progress')

module.exports = function stats (deviceManager) {
  const bar = new ProgressBar('Time :elapsed: | Devices :devices | Measurements :measurements | Writes :writes | Size :size kb | Errors :errors', {total: 1000000})

  const update = stats => {
    stats.size = Math.round((stats.size / 1024).toFixed(2))
    bar.tick(stats)
  }

  setInterval(() => {
    update(deviceManager.getStats())
  }, 100)

  return update
}
