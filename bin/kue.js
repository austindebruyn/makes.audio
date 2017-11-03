const kue = require('kue')
const queue = kue.createQueue()
const sendEmail = require('../api/jobs/sendEmail')
const getAudioLength = require('../api/jobs/getAudioLength')

queue.process('email', sendEmail.process)
queue.process('ffprobe', getAudioLength.process)
