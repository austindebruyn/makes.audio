import not_found from './not_found'
import { shallow } from 'avoriaz'

describe 'not_found', ->
  it 'should render text', ->
    wrapper = shallow not_found
    expect(wrapper.text()).to.contain 'Error 404'
    expect(wrapper.text()).to.contain "This page doesn't exist!"
