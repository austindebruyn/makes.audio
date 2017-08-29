import VueRouter from 'vue-router'
import 'components/root'
import Login from 'components/auth/login'
import CreateAccount from 'components/auth/create_account'
import Dashboard from 'components/dashboard'
import EditAudio from 'components/edit_audio'
import NotFound from 'components/not_found'
import Settings from 'components/settings'
import store from 'state/store'

ensureAuthenticated = (to, from, next) ->
  return next '/' unless store.store.getState().user
  next()
ensureAnonymous = (to, from, next) ->
  return next '/dashboard' if store.store.getState().user
  next()

export default new VueRouter
  mode: 'history'
  routes: [
    ( path: '/', component: Login, beforeEnter: ensureAnonymous )
    ( path: '/create', component: CreateAccount, beforeEnter: ensureAnonymous )
    ( path: '/dashboard', component: Dashboard, beforeEnter: ensureAuthenticated )
    ( path: '/audios/:id/edit', component: EditAudio, beforeEnter: ensureAuthenticated )
    ( path: '/settings', component: Settings, beforeEnter: ensureAuthenticated )
    ( path: '*', component: NotFound )
  ]
