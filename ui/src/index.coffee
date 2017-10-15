import build_vm from './build_vm'

root = document.getElementById 'root'

vm = build_vm
  user: JSON.parse root.getAttribute 'data-user'
  context: JSON.parse root.getAttribute 'data-context'
vm.$mount '#root'
