login = (user) ->
  type: 'LOGIN'
  user: user

logout = ->
  type: 'LOGOUT'

export default
  login: login
  logout: logout
