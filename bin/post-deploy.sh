yarn
NODE_ENV=production npm run build
NODE_ENV=production node bin/migrate
pm2 startOrRestart /var/makes.audio/ecosystem.json --env production

export GIT_COMMIT="`git rev-parse HEAD`"
curl https://sentry.io/api/hooks/release/builtin/213755/$SENTRY_RELEASE_TOKEN/ \
  -X POST \
  -H 'Content-Type: application/json' \
  -d '{"version": "$GIT_COMMIT"}'
