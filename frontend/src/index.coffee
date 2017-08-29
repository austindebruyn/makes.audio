import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import router from 'router'

import 'components/root'
import 'components/app_template'
import 'components/auth/auth_template'
import 'components/auth/login'
import 'components/auth/create_account'
import 'components/loading'
import 'components/flash'
import 'components/flash_container'
import 'components/settings/user_form'
import 'components/dashboard/audio_list'
import 'components/dashboard/audio_list_item'
import 'components/edit_audio/stats_card'
import 'components/dashboard/text_with_search_highlight'

import 'components/ui/input_text'
import 'components/ui/card'

import 'whatwg-fetch'
import store from 'state/store'
import actions from 'state/actions'

# hydrate
user = document.getElementById('root').getAttribute 'data-user'
store.dispatch actions.login JSON.parse user if user

vm = new Vue
  router: router
vm.$mount '#root'
