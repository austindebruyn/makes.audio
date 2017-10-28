import sinon from 'sinon'
import Vue from 'vue'

tween_spy = sinon.spy()

before ->
  @tween_spy = tween_spy

afterEach ->
  tween_spy.reset()

export default ->
  Vue.use
    install: (Vue) ->
      Vue.prototype.$tween = tween_spy
