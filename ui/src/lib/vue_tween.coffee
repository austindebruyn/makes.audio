import TWEEN from '@tweenjs/tween.js'

running = false

animate = ->
  running = TWEEN.update()
  requestAnimationFrame animate if running

VueTween =
  install: (Vue) ->
    Vue.prototype.$tween = (obj, duration) ->
      @tween.stop() if @tween

      @tween = new TWEEN.Tween @
        .to obj, duration
        .easing TWEEN.Easing.Cubic.Out
        .start()

      animate() unless running

export default VueTween
