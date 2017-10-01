import build_vm from './build_vm'

vm = build_vm
  user: JSON.parse document.getElementById('root').getAttribute 'data-user'
  context: JSON.parse document.getElementById('root').getAttribute 'data-context'
vm.$mount '#root'
