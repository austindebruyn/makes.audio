if [[ -z "$CI" || -z "$TRAVIS" ]]; then
  # Not running on CI, so build is trusted
  exit 1
fi

if [[ -z "$SAUCE_USERNAME" ]]; then
  # Build is running on CI and is not trusted
  exit 0
fi

# Build is running on CI but has $SAUCE_USERNAME, so it's trusted.
exit 1
