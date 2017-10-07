import pull from 'lodash.pull'
import remove from 'lodash.remove'

i = 0
flashes = []
handlers =
  create: []
  dismiss: []

$emit = (evt, arg) ->
  handlers[evt].forEach (fn) -> fn arg

create_flash = (level, message, title=null, dismissable=true) ->
  new_flash =
    id: i++
    level: level
    message: message
    title: title
    dismissable: dismissable
  flashes.unshift new_flash
  $emit 'create', new_flash
  setTimeout((-> destroy_flash new_flash.id), 5000)
destroy_flash = (id) ->
  removed = remove(flashes, id: id)
  $emit 'dismiss', removed[0] if removed.length > 0

export default {
  flashes: flashes
  create: create_flash
  destroy: destroy_flash
  $on: (evt, handler) -> handlers[evt].push handler
  $off: (evt, handler) -> pull handlers[evt], handler
}
