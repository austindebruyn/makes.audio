import auth_template from './auth_template'
import { mount, shallow } from 'avoriaz'
import hero_image from './landing-page/hero-image@2k.jpg'

describe 'auth_template', ->
  it 'should render element', ->
    wrapper = shallow auth_template
    expect(wrapper.hasClass('landing-page')).to.be.true

  it 'should have background image', ->
    wrapper = shallow auth_template
    image_is_present = wrapper
      .first('.landing-page-image')
      .hasStyle('background-image', "url(#{hero_image})")
    expect(image_is_present).to.be.true

  it 'should render slots', ->
    wrapper = mount auth_template, slots:
      default: (template: '<div id="slot"></div>')
    expect(wrapper.contains('.landing-page .container > #slot')).to.be.true
