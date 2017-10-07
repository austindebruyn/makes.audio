import Vue from 'vue'
import VueRouter from 'vue-router'
import 'components/root'
import Login from 'components/auth/login'
import CreateAccount from 'components/auth/create_account'
import NewPasswordReset from 'components/auth/password-resets/new'
import CompletePasswordReset from 'components/auth/password-resets/complete'
import VerifyEmail from 'components/auth/verify-email'
import Dashboard from 'components/dashboard'
import EditAudio from 'components/edit_audio'
import NotFound from 'components/not_found'
import Settings from 'components/settings'
import store from 'state/store'

Vue.use VueRouter

ensureAuthenticated = (to, from, next) ->
  return next '/' unless store.state.user
  next()

ensureAnonymous = (to, from, next) ->
  return next '/dashboard' if store.state.user
  next()

export default new VueRouter
  mode: 'history'
  routes: [
    ( path: '/', component: Login, beforeEnter: ensureAnonymous )
    ( path: '/create', component: CreateAccount, beforeEnter: ensureAnonymous )
    ( path: '/passwordResets/new', component: NewPasswordReset, beforeEnter: ensureAnonymous )
    ( path: '/passwordResets/complete', component: CompletePasswordReset, beforeEnter: ensureAnonymous )
    ( path: '/users/me/emailPreferences/verify', component: VerifyEmail )
    ( path: '/dashboard', component: Dashboard, beforeEnter: ensureAuthenticated )
    ( path: '/audios/:id/edit', component: EditAudio, beforeEnter: ensureAuthenticated )
    ( path: '/settings', component: Settings, beforeEnter: ensureAuthenticated )
    ( path: '*', component: NotFound )
  ]
