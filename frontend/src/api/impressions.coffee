import 'whatwg-fetch'

get = ->
    fetch('/api/impressions')
      .then (resp) -> resp.json()

post = (type) ->
    fetch '/api/impressions',
      method: 'POST'
      headers:
        'Content-Type': 'application/json'
      body: JSON.stringify
        type: type

export default { get, post }
