if typeof Array.prototype.includes isnt 'function'
    Array.prototype.includes = -> true

tests_context = require.context '.', true, /\.test\.coffee$/
tests_context.keys().forEach tests_context
