export default {
  chicken:
    id: 1
    url: 'chicken.mp3'
    mimetype: 'audio/mpeg'
    createdAt: new Date('2017-07-31T00:00:00.001Z')
    description: 'A chick bok-bok'
    publicUrl: '/chicken.mp3'
    downloadUrl: '/chicken.mp3/download'
    editUrl: '/audios/1/edit'
    updateUrl: '/api/audios/1'
    duration: 3
    visible: true
  invisible:
    id: 2
    url: 'invisible.mp3'
    mimetype: 'audio/mpeg'
    createdAt: new Date('2017-07-31T00:00:00.001Z')
    description: 'Need lemon juice to see this'
    publicUrl: '/invisible.mp3'
    downloadUrl: '/invisible.mp3/download'
    editUrl: '/audios/2/edit'
    updateUrl: '/api/audios/2'
    duration: 3
    visible: false
  extensionless:
    id: 3
    url: 'extensionless'
    mimetype: 'audio/mpeg'
    createdAt: new Date('2017-07-31T00:00:00.001Z')
    description: 'What am I in this big big world...'
    publicUrl: '/extensionless'
    downloadUrl: '/extensionless/download'
    editUrl: '/audios/3/edit'
    updateUrl: '/api/audios/3'
    duration: 3
    visible: true
}
