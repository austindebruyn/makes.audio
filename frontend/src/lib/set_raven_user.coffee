import Vue from 'vue'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'

r            = null
user_id      = 'unset'
context      = JSON.parse document.getElementById('root').getAttribute 'data-context'
public_token = context.sentry.public

if public_token
  r = Raven.config "https://10f63196556e49539a4943f999704f15@sentry.io/213761"
  r.addPlugin RavenVue, Vue
  r.install()

export default (user={}) ->
  return unless r
  if user_id == 'unset' or user_id != user.id
    Raven.setUserContext user
    user_id = user.id
