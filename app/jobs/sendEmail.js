const kue = require('kue')
const config = require('../config')
const getKue = require('./getKue')

/**
 * Promises to push a job onto the queue with the given name and data.
 * This is basically a Promisif-ied version of queue.create
 * @param  {string} name
 * @param  {Object} data
 * @return {Promise}
 */
function createKueJob(name, data) {
  return new Promise(function (resolve, reject) {
    const job = getKue().create(name, data).save(function (err) {
      if (err) return reject(err)
      return resolve(job)
    })
  })
}

/**
 * Queues an email job.
 * @param  {string} to
 * @param  {string} title
 * @param  {string} template
 * @return {Promise}
 */
function queue(to, title, template, data) {
  return createKueJob('email', {
    to,
    title,
    template,
    data
  })
}

/**
 * Processes a kue job.
 * @param  {Object} job
 * @param  {Function} callback
 * @return {Promise}
 */
function process(job, done) {
  if (!config.app.mailgun.key) {
    return done(new Error('No mailgun API key. Is the app in test mode?'))
  }

  const mailgun = require('mailgun-js')({
    apiKey: config.app.mailgun.key,
    domain: config.app.mailgun.domain
  })

  const data = {
    from: 'makes.audio <donotreply@mg.makes.audio>',
    to: job.data.to,
    subject: job.data.title,
    text: job.data.template + ' ' + job.data.data.passwordResetId
  }

  mailgun.messages().send(data, function (err, body) {
    if (err) return done(err)

    job.log(body)
    return done()
  })
}

module.exports = {
  queue,
  process
}
