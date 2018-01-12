if [[ -z "$CI" || -z "$TRAVIS" ]]; then
  echo "Not running on CI. Build is trusted"
  exit 0
fi

if [[ -z "$SAUCE_USERNAME" ]]; then
  echo "Build is not trusted."
  exit 1
fi
