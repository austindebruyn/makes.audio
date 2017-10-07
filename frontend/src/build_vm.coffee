import pick from 'lodash.pick'
import Vue from 'vue'
import Vuex from 'vuex'

import build_raven from 'lib/build_raven'

import router from 'router'

import 'components/root'
import 'components/app_template'
import 'components/auth/auth_template'
import 'components/auth/login'
import 'components/auth/create_account'
import 'components/loading'
import 'components/flash'
import 'components/uploads_progress'
import 'components/flash_container'
import 'components/settings/user_form'
import 'components/dashboard/audio_list'
import 'components/dashboard/audio_list_item'
import 'components/dashboard/upload'
import 'components/edit_audio/stats_card'
import 'components/dashboard/text_with_search_highlight'

import 'components/ui/input_text'
import 'components/ui/card'

import 'whatwg-fetch'
import store from 'state/store'

export default (opts) ->
  # hydrate
  user = opts.user
  raven = build_raven opts.context.sentry
  # store.store.subscribe ->
  #   if raven
  #     raven.set_raven_user pick(store.state.user, 'id', 'username', 'email')
  store.commit 'set_user', user: user

  new Vue
    store: store
    router: router
