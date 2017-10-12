import loading from '.'
import { mount, shallow } from 'avoriaz'

describe 'loading', ->
  it 'should render image', ->
    wrapper = shallow loading
    expect(wrapper.first('img').getAttribute('src')).to.match /\.svg$/

  it 'should render text', ->
    wrapper = shallow loading
    expect(wrapper.text()).to.eql 'Loading...'

  it 'should be centered', ->
    wrapper = shallow loading
    expect(wrapper.hasStyle('text-align', 'center')).to.be.true
