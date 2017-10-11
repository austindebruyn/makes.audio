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

beforeEach ->
  @fetches = []
  Object.defineProperty @fetches, 'first', get: -> @[0]

  global.fetch = (url, descriptor) =>
    new Promise (resolve, reject) =>
      fetch_obj = Object.assign {}, descriptor,
        url: url
        respond_with: ({ status=200, body }) ->
          response =
            status: status
            headers: {}
          if body?
            response.json = -> new Promise (r) -> r body
          resolve response
        reject: reject
      fetch_obj.body = JSON.parse fetch_obj.body if fetch_obj.body?
      @fetches.push fetch_obj

  @fill_in = (wrapper) ->
    with: (value) ->
      wrapper.element.value = value
      wrapper.trigger 'input'

tests_context = require.context '.', true, /\.test\.coffee$/
tests_context.keys().forEach tests_context
