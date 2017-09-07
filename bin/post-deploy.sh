yarn
NODE_ENV=production npm run build
NODE_ENV=production node bin/migrate
pm2 startOrRestart /var/makes.audio/ecosystem.json --env production
curl https://sentry.io/api/hooks/release/builtin/213755/3e00f2a5bf9d3c4d3bf48c7af296081c96caace519b30fa0f2baafd668f8aa2a/ \
  -X POST \
  -H 'Content-Type: application/json' \
  -d '{"version": "`git rev-parse HEAD`"}'
