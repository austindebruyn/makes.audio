set_audios = (audios) ->
  type: 'SET_AUDIOS'
  audios: audios
add_audio = (audio) ->
  type: 'ADD_AUDIO'
  audio: audio
update_audio = (audio) ->
  type: 'UPDATE_AUDIO'
  audio: audio

export default {
  set_audios: set_audios
  add_audio: add_audio
  update_audio: update_audio
}
