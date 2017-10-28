const fs = require('fs')
const path = require('path')

module.exports = function (audio, res, isDownload = false) {
  const filePath = path.join(__dirname, '..', 'store', audio.filename || audio.hash)
  const stat = fs.statSync(filePath)

  if (isDownload) {
    return res.download(filePath, audio.url, function (err) {
      if (err) throw err
    })
  }

  res.writeHead(200, {
    'Content-Type': audio.mimetype,
    'Content-Length': stat.size
  })

  return fs.createReadStream(filePath).pipe(res)
}
