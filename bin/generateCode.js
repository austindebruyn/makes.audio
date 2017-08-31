const InviteCode = require('../app/domain/inviteCodes/InviteCode')
const db = require('../app/services/db')

let string = ''
for (let i = 0; i < 8; i++) {
  string += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]
}

InviteCode.create({ code: string }).then(function (invite) {
  console.dir(invite.dataValues)
  db.close()
})
