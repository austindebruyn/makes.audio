import build_vm from './build_vm'

vm = build_vm
  user: document.getElementById('root').getAttribute 'data-user'
  context: document.getElementById('root').getAttribute 'data-context'
vm.$mount '#root'
