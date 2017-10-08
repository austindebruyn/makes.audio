import toast from './toast'
import { mount } from 'avoriaz'

describe 'toast', ->
  it 'should render message and title', ->
    wrapper = mount toast, propsData:
      level: 'info'
      message: 'the stock market crashed'
    expect(wrapper.text()).to.eql 'the stock market crashed'

    wrapper = mount toast, propsData:
      level: 'info'
      message: 'the stock market crashed'
      title: 'uh-oh'
    expect(wrapper.text()).to.eql 'uh-ohthe stock market crashed'

  it 'renders button if dismissable', ->
    wrapper = mount toast, propsData:
      level: 'info'
      dismissable: true
      message: 'hey'
    expect(wrapper.contains('button.close')).to.be.true
    wrapper = mount toast, propsData:
      level: 'info'
      dismissable: false
      message: 'hey'
    expect(wrapper.contains('button.close')).to.be.false

  it 'renders the correct classes', ->
    wrapper = mount toast, propsData:
      level: 'danger'
      message: 'yay'
    expect(wrapper.hasClass('alert')).to.be.true
    expect(wrapper.hasClass('alert-danger')).to.be.true
    expect(wrapper.hasClass('dead')).to.be.false
    wrapper = mount toast, propsData:
      dead: true
      message: 'yay'
      level: 'warning'
    expect(wrapper.hasClass('alert')).to.be.true
    expect(wrapper.hasClass('alert-warning')).to.be.true
    expect(wrapper.hasClass('dead')).to.be.true

  it 'renders the correct styles', ->
    wrapper = mount toast, propsData:
      level: 'info'
      idx: 0
      message: 'im at the top'
    expect(wrapper.getAttribute('style')).to.include('top: 0px;')
    wrapper = mount toast, propsData:
      level: 'info'
      idx: 2
      message: 'im at the top'
    expect(wrapper.getAttribute('style')).to.include('top: 180px;')

  it 'emits click', (done) ->
    wrapper = mount toast, propsData:
      dismissable: true
      level: 'info'
      message: 'hey'
    wrapper.vm.$on 'click', done
    wrapper.first('button.close').element.click()
