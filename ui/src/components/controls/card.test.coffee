import card from './card'
import { mount, shallow } from 'avoriaz'

describe 'card', ->
  it 'should render element', ->
    wrapper = shallow card
    expect(wrapper.hasClass('card')).to.be.true

  it 'should render slots', ->
    wrapper = mount card, slots:
      default: (template: '<div id="slot"></div>')
    expect(wrapper.contains('.card > #slot')).to.be.true
