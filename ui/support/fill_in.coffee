fill_in = (wrapper) ->
  with: (value) ->
    wrapper.element.value = value
    wrapper.trigger 'input'

export default fill_in
