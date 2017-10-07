import pull from 'lodash.pull'
import remove from 'lodash.remove'

i = 0

toasts = []

handlers =
  create: []
  dismiss: []

$emit = (evt, arg) ->
  handlers[evt].forEach (fn) -> fn arg

create_toast = (level, message, title=null, dismissable=true) ->
  new_toast =
    id: i++
    level: level
    message: message
    title: title
    dismissable: dismissable
  toasts.unshift new_toast
  $emit 'create', new_toast
  setTimeout((-> destroy_toast new_toast.id), 5000)

destroy_toast = (id) ->
  removed = remove(toasts, id: id)
  $emit 'dismiss', removed[0] if removed.length > 0

export { toasts, create_toast, destroy_toast }
export $on = (evt, handler) -> handlers[evt].push handler
export $off = (evt, handler) -> pull handlers[evt], handler
