const kue = require('kue')
const queue = kue.createQueue()
const sendEmail = require('../app/jobs/sendEmail')

queue.process('email', sendEmail.process)
