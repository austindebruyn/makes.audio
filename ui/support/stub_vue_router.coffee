import Vue from 'vue'

stub_vue_router = ->
  return if router_view?

  global.router_view =
    name: 'router-view'
  Vue.component 'router-view', router_view

  global.router_link =
    name: 'router-link'
    props: ( to: String )
    render: (h) -> h('div')
  Vue.component 'router-link', router_link

export default stub_vue_router
