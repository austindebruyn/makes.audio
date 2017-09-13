const kue = require('kue')
const { promisify } = require('util')

const queue = kue.createQueue()

const n = process.env.N || 10

function remove(job) {
  return new Promise(function (resolve, reject) {
    return job.remove(function (err) {
      if (err) return reject()
      console.log(`Finished removing job ${job.id}`)
      return resolve()
    })
  })
}

kue.Job.rangeByState('complete', 0, n, 'asc', function (err, jobs) {
  if (err) throw err

  return Promise.all(jobs.map(job => remove(job)))
    .then(function () {
      console.log('All done')

      queue.shutdown(5000, function (err) {
        if (err) throw err
        process.exit(0)
      })
    })
    .catch(function (err) {
      console.error(err)
    })
})
