const kue = require('kue')
const queue = kue.createQueue()
const sendEmail = require('../api/jobs/sendEmail')

queue.process('email', sendEmail.process)
