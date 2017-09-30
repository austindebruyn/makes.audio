import Vue from 'vue'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'

raven = null

export default (opts) ->
  return raven if raven
  user_id      = 'unset'
  public_token = opts.public

  if public_token
    raven = Raven.config "https://10f63196556e49539a4943f999704f15@sentry.io/213761"
    raven.addPlugin RavenVue, Vue
    raven.install()

    raven.set_raven_user = (user={}) ->
      return unless raven
      if user_id == 'unset' or user_id != user.id
        Raven.setUserContext user
        user_id = user.id
  raven
