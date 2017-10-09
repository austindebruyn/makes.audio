import input_text from './input_text'
import { mount } from 'avoriaz'
import { nextTick } from 'vue'

describe 'input_text', ->
  it 'should not render an icon', ->
    wrapper = mount(input_text, propsData: {})
    expect(wrapper.contains('.fa')).to.be.false

  it 'should render an icon if there is one', ->
    wrapper = mount(input_text, propsData: (icon: 'user'))
    expect(wrapper.first('.fa').hasClass('fa-user')).to.be.true

  it 'should disable', ->
    wrapper = mount(input_text, propsData: (disabled: false))
    expect(wrapper.contains('input:disabled')).to.be.false
    wrapper = mount(input_text, propsData: (disabled: true))
    expect(wrapper.contains('input:disabled')).to.be.true

  it 'should render correct input', ->
    wrapper = mount input_text, propsData:
      type: 'email'
      name: 'username'
      placeholder: 'Enter Username'
    input = wrapper.first('input').element
    expect(input.getAttribute('name')).to.eql 'username'
    expect(input.getAttribute('placeholder')).to.eql 'Enter Username'
    expect(input.getAttribute('type')).to.eql 'email'

  it 'should store focus', ->
    wrapper = mount input_text
    expect(wrapper.vm.focus).to.be.false
    wrapper.vm.handle_focus()
    expect(wrapper.vm.focus).to.be.true
    wrapper.vm.handle_blur()
    expect(wrapper.vm.focus).to.be.false
