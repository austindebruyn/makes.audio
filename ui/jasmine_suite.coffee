import es6promise from 'es6-promise'
import chai, { expect } from 'chai'
import sinon_chai from 'sinon-chai'

import Vue from 'vue'

router_view =
  name: 'router-view'
  render: (h) -> h('div')
Vue.component 'router-view', router_view
router_link =
  name: 'router-link'
  render: (h) -> h('div')
Vue.component 'router-link', router_link

es6promise.polyfill()

chai.use sinon_chai

global.expect = expect

tests_context = require.context '.', true, /\.test\.coffee$/
tests_context.keys().forEach tests_context
