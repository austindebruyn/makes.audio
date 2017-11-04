import compact from 'lodash.compact'

class DurationFormatter
  @format: (duration) ->
    duration = duration or 0
    duration = Math.round duration

    minutes = Math.floor(duration / 60)
    seconds = duration % 60

    compact([
      minutes > 0 and "#{minutes} min"
      (minutes < 1 or seconds > 0) and "#{seconds} sec"
    ]).join ' '

export default DurationFormatter
