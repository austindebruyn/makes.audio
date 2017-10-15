import text_with_search_highlight from './text_with_search_highlight'
import { mount } from 'avoriaz'

describe 'text-with-search-highlight', ->
  it 'should render text with no q', ->
    wrapper = mount(text_with_search_highlight, propsData: (text: 'hey'))
    expect(wrapper.text()).to.eql 'hey'

  it 'should render text with q in center', ->
    wrapper = mount text_with_search_highlight, propsData:
      text: 'hey'
      q: 'e'
    expect(wrapper.text()).to.eql 'hey'

    highlight_el = wrapper.first('.q-highlight')
    expect(highlight_el.hasStyle('background-color', 'yellow')).to.be.true
    expect(highlight_el.text()).to.eql 'e'
