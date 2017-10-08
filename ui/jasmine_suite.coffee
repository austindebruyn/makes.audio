import es6promise from 'es6-promise'
import chai, { expect } from 'chai'
import sinon_chai from 'sinon-chai'

es6promise.polyfill()

chai.use sinon_chai

global.expect = expect

tests_context = require.context '.', true, /\.test\.coffee$/
tests_context.keys().forEach tests_context
