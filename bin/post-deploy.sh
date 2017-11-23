. /etc/profile
yarn
NODE_ENV=production npm run build
NODE_ENV=production node bin/migrate
pm2 startOrRestart /var/makes.audio/ecosystem.json --env production
