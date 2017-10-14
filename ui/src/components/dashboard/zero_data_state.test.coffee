import zero_data_state from './zero_data_state'
import { mount, shallow } from 'avoriaz'

describe 'zero_data_state', ->
  it 'should render', ->
    wrapper = shallow zero_data_state
    expect(wrapper.text()).to.include 'NOTHING HERE'
