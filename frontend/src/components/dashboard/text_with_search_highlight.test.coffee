# // Import Vue and the component being tested
# import Vue from 'vue'
# import MyComponent from 'path/to/MyComponent.vue'
# // Here are some Jasmine 2.0 tests, though you can
# // use any test runner / assertion library combo you prefer
# describe('MyComponent', () => {
#   // Inspect the raw component options
#   it('has a created hook', () => {
#     expect(typeof MyComponent.created).toBe('function')
#   })
#   // Evaluate the results of functions in
#   // the raw component options
#   it('sets the correct default data', () => {
#     expect(typeof MyComponent.data).toBe('function')
#     const defaultData = MyComponent.data()
#     expect(defaultData.message).toBe('hello!')
#   })
#   // Inspect the component instance on mount
#   it('correctly sets the message when created', () => {
#     const vm = new Vue(MyComponent).$mount()
#     expect(vm.message).toBe('bye!')
#   })
#   // Mount an instance and inspect the render output
#   it('renders the correct message', () => {
#     const Ctor = Vue.extend(MyComponent)
#     const vm = new Ctor().$mount()
#     expect(vm.$el.textContent).toBe('bye!')
#   })
# })

import Vue from 'vue'
import text_with_search_highlight from './text_with_search_highlight'

describe 'text-with-search-highlight', ->
  it 'has a created hook', ->
    Ctor = Vue.extend text_with_search_highlight
    vm = new Ctor(propsData: (text: 'hey')).$mount()
    expect(vm.$el.innerHTML).toBe '<span class="before-q">hey</span><span class="q-highlight"></span><span class="after-q"></span>'