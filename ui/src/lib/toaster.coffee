import pull from 'lodash.pull'
import remove from 'lodash.remove'

class Toaster
  DEFAULT_TIMEOUT = 5000

  @_i = 0
  @_toasts = []

  @_handlers =
    create: []
    dismiss: []
    timeouts: []

  @count = -> @_toasts.length
  @all = -> @_toasts.slice 0
  @at = (idx) -> @_toasts[idx]

  @$on = (evt, handler) -> @_handlers[evt].push handler
  @$off = (evt, handler) -> pull @_handlers[evt], handler

  @$emit = (evt, arg) ->
    @_handlers[evt].forEach (fn) -> fn arg

  @create = (level, message, title=null, dismissable=true) ->
    if level not in ['danger', 'info', 'success', 'warn']
      throw new Error("Toaster.create invoked with level=#{level}")
    new_toast =
      id: @_i++
      level: level
      message: message
      title: title
      dismissable: dismissable
    @_toasts.unshift new_toast
    @$emit 'create', new_toast

    timeout_handler = =>
      @destroy new_toast.id
      pull @_handlers.timeouts, timeout_ref
    timeout_ref = setTimeout timeout_handler, Toaster.DEFAULT_TIMEOUT
    @_handlers.timeouts.push timeout_ref

    new_toast

  @destroy = (id) ->
    removed = remove(@_toasts, id: id)
    @$emit 'dismiss', removed[0] if removed.length > 0

  @destroy_all_toasts = ->
    @_i = 0
    @_toasts.length = 0
    @_handlers.create.length = 0
    @_handlers.dismiss.length = 0
    clearTimeout ref for ref in @_handlers.timeouts
    @_handlers.timeouts.length = 0

export default Toaster
