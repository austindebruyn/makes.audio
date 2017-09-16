const defineJob = require('./defineJob')
const mailgun = require('../services/mailgun')

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

    return mg.messages()
      .send({
        from: 'makes.audio <donotreply@mg.makes.audio>',
        to: data.to,
        subject: data.subject,
        text: data.template + ' ' + data.values.passwordResetId
      })
      .then(function (body) {
        job.log(body)
      })
  }
})
