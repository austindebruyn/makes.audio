const Audio = require('./Audio')
const path = require('path')

/**
 * Revolves the url by appending a number. If the number is already there,
 * increment it by one.
 * @param {String} url 
 */
function increment(url) {
  const ext = path.extname(url)
  const basename = path.basename(url, ext)

  const numberMatcher = basename.match(/(.+)\-(\d+)$/)

  const number = numberMatcher === null
    ? 1
    : parseInt(numberMatcher[2], 10) + 1

  const newBasename = numberMatcher === null
    ? basename
    : numberMatcher[1]

  return `${newBasename}-${number}${ext}`
}

/**
 * Try the given url. If it is unique, resolve immediately, otherwise
 * increment the url and recurse with that url.
 * @param {String} url 
 */
function tryUrl(userId, url) {
  return new Promise(function (resolve, reject) {
    return Audio.count({ where: { userId, url } }).then(function (count) {
      if (count === 0) {
        return resolve(url)
      }

      return tryUrl(userId, increment(url))
        .then(resolve)
        .catch(reject)
    })
  })
}

/**
 * Promises to return a unique url for the given user and base url.
 * @param {Object} userId, url
 */
function getUniqueUrl({ userId, url }) {
  return tryUrl(userId, url)
}

module.exports = {
  getUniqueUrl,
  increment
}
