import toast_container from './toast_container'
import toast from './toast'
import Toaster from 'lib/toaster'
import { nextTick } from 'vue'
import { mount, shallow } from 'avoriaz'

describe 'toast-container', ->
  afterEach ->
    Toaster.destroy_all_toasts()

  it 'should render nothing', ->
    wrapper = mount toast_container
    expect(wrapper.contains(toast)).to.be.false

  it 'should render a toast', (done) ->
    Toaster.create 'info', 'hows it going', 'breaking news'
    wrapper = mount toast_container
    nextTick ->
      expect(wrapper.contains(toast)).to.be.true
      child = wrapper.first(toast)
      expect(child.vm.$props).to.include
        idx: 0
        level: 'info'
        dismissable: true
        title: 'breaking news'
        message: 'hows it going'
      done()

  it 'should render new toasts when they are created', ->
    Toaster.create 'warning', 'uh-oh'
    wrapper = mount toast_container
    nextTick().then ->
      expect(wrapper.find(toast).length).to.eql 1
      child = wrapper.first(toast)
      expect(child.vm.$props).to.include idx: 0, message: 'uh-oh'

      Toaster.create 'success', 'all good'
      nextTick()
    .then ->
      expect(wrapper.find(toast).length).to.eql 2
      child = wrapper.first(toast)
      expect(child.vm.$props).to.include idx: 1, message: 'uh-oh'
      child = wrapper.find(toast)[1]
      expect(child.vm.$props).to.include idx: 0, message: 'all good'

  it 'should remove toasts from the list', ->
    Toaster.create 'info', 'hows it going'
    ref = Toaster.create 'warning', 'tornado is coming'
    wrapper = mount toast_container
    nextTick().then ->
      first_child = wrapper.find(toast)[0]
      second_child = wrapper.find(toast)[1]

      expect(first_child.vm.$props.message).to.eql 'hows it going'
      expect(second_child.vm.$props.message).to.eql 'tornado is coming'

      Toaster.destroy ref.id
      nextTick()
    .then ->
      expect(wrapper.find(toast)[1].vm.$props.dead).to.be.true
      new Promise (r) -> setTimeout r, 201
    .then -> nextTick()
    .then ->
      expect(wrapper.find(toast).length).to.eql 1
      expect(wrapper.first(toast).vm.$props.message).to.eql 'hows it going'
