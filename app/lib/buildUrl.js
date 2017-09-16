const config = require('../config')

module.exports = function (path = '', subdomain = null) {
  const portWithColon = config.app.port ? `:${config.app.port}` : ''
  const subdomainWithDot = subdomain ? `${subdomain}.` : ''
  const pathWithSlash = path.length === 0 ? '' : (path[0] === '/' ? path : `/${path}`)
  const url = `${config.app.protocol}://${subdomainWithDot}${config.app.host}${portWithColon}${pathWithSlash}`

  return url
}
