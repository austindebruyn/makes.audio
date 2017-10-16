import es6promise from 'es6-promise'
import chai, { expect } from 'chai'
import sinon_chai from 'sinon-chai'
import stub_vue_router from './support/stub_vue_router'
import fill_in from './support/fill_in'
import stub_fetch_mixin from './support/stub_fetch_mixin'
import stub_date_mixin from './support/stub_date_mixin'

es6promise.polyfill()
chai.use sinon_chai
global.expect = expect

stub_vue_router()

before ->
  Object.assign @, stub_fetch_mixin
  Object.assign @, stub_date_mixin
  @stub_date()
  @stub_fetch()

  @fill_in = fill_in.bind @

after ->
  @restore_stub_fetch()
  @restore_stub_date()

beforeEach ->
  @reset_stub_fetch()

tests_context = require.context '.', true, /\.test\.coffee$/
tests_context.keys().forEach tests_context
