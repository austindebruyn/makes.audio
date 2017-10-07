const assert = require('assert')
const kue = require('kue')
const queue = kue.createQueue()

/**
 * Promises to push a job onto the queue with the given name and data.
 * This is basically a Promisif-ied version of queue.create
 * @param  {string} name
 * @param  {Object} data
 * @return {Promise}
 */
function enqueueKueJob(name, data) {
  return new Promise(function (resolve, reject) {
    const job = queue.create(name, data).save(function (err) {
      if (err) return reject(err)

      setImmediate(function () {
        return resolve(job)
      })
    })
  })
}

/**
 * Matches the `args` object against a set of `argTypes` definitions. Throws an
 * error when the first mismatch is found.
 * @param  {Object} args
 * @param  {Object} argTypes   an object of strings like 'string', 'number', ...
 * @param  {String} queueName
 * @throws {Error}  when one of the args is wrong
 */
function validateArgTypes(args, argTypes, queueName) {
  Object.keys(argTypes).forEach(function (key) {
    const actualTypeof = typeof args[key]
    const expectedTypeof = typeof (argTypes[key]())

    if (actualTypeof !== expectedTypeof) {
      const message = typeof args[key] === 'undefined'
        ? `kue job ${queueName} was missing arg '${key}'`
        : `kue job ${queueName} expected arg '${key}' of type '${expectedTypeof}' but got '${actualTypeof}'`
      throw new Error(message)
    }
  })
}

/**
 * Returns a function that can be used to queue the provided asynchronous task.
 * When the returned function is called, the job is entered onto the queue but
 * `perform` is called later on the job process.
 *
 * Example job description looks like:
 *   createKueJob({
 *     queueName: 'add-numbers',
 *     args: { a: Number, b: Number },
 *     perform: (data, job) => data.a + data.b
 *   })
 * This job could be invoked like:
 *   addNumbers({ a: 2, b: 2 })
 * and the job thread would later process 4, which would be viewable in the Kue
 * UI.
 *
 * @param  {Object} descriptor contains a `name` and `perform` func
 * @return {Function}
 */
function defineKueJob({ perform, queueName, args = {} }) {
  assert.equal(typeof queueName, 'string')
  assert.equal(typeof perform, 'function')
  assert.equal(typeof args, 'object')

  function dummy(data) {
    return new Promise(function (resolve, reject) {
      validateArgTypes(data, args, queueName)

      return enqueueKueJob(queueName, data)
        .then(resolve)
        .catch(reject)
    })
  }

  dummy.process = function (job, done) {
    return Promise.resolve(job)
      .then((job) => perform(job.data, job))
      .then(function () {
        return done(null)
      })
      .catch(done)
  }

  return dummy
}

module.exports = defineKueJob
