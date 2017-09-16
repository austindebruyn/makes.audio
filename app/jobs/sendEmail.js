const defineJob = require('./defineJob')
const mailgun = require('../services/mailgun')
const pug = require('pug')
const path = require('path')

/**
 * Returns a compiled pug template.
 * @param  {string}   name
 * @return {Function} Can be called with values and will return html as string.
 */
function getTemplate(name) {
  return pug.compileFile(path.resolve(__dirname, '..', 'views', 'emails', `${name}.pug`))
}

module.exports = defineJob({
  queueName: 'email',

  args: {
    to: String,
    subject: String,
    template: String,
    values: Object
  },

  /**
   * Promises to process a fulfill the email-sending job.
   * @param  {Object}  data
   * @param  {Object}  job
   * @return {Promise}
   */
  perform: function perform(data, job) {
    const mg = mailgun.get()
    const { to, subject } = data
    const text = getTemplate(data.template)(data.values)

    return mg.messages()
      .send({
        from: 'makes.audio <donotreply@mg.makes.audio>',
        to,
        subject,
        text
      })
      .then(function (body) {
        job.log(body)
      })
  }
})
