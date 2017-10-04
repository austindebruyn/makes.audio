import { expect } from 'chai'

global.expect = expect

tests_context = require.context '.', true, /\.test\.coffee$/
tests_context.keys().forEach tests_context
