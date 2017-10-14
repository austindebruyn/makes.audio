import zero_data_state from './zero_data_state'
import { mount } from 'avoriaz'

describe 'zero_data_state', ->
  it 'should render', ->
    wrapper = mount zero_data_state
    expect(wrapper.text()).to.include 'Nothing here'
