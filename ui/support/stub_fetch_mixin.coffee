export default {
  stub_fetch: ->
    global.fetch = (url, descriptor) ->
      new Promise (resolve, reject) =>
        fetch_obj = Object.assign {}, descriptor,
          url: url
          respond_with: ({ status=200, body }) ->
            response =
              status: status
              headers: {}
            if body?
              response.json = -> new Promise (r) -> r body
            resolve response
          reject: reject
        fetch_obj.body = JSON.parse fetch_obj.body if fetch_obj.body?
        @fetches.push fetch_obj
    global.fetch = fetch.bind @
    @reset_stub_fetch()

  reset_stub_fetch: ->
    @fetches = []
    Object.defineProperty @fetches, 'first', get: -> @[0]

  restore_stub_fetch: ->
    @reset_stub_fetch()
    @fetches = null
    delete @stub_fetch
}
