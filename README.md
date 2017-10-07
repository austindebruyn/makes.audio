# makes.audio

[![Build Status](https://travis-ci.org/austindebruyn/makes.audio.svg?branch=master)](https://travis-ci.org/austindebruyn/makes.audio)
[![Coverage Status](https://coveralls.io/repos/austindebruyn/makes.audio/badge.svg?branch=master)](https://coveralls.io/r/austindebruyn/makes.audio?branch=master)


Easy synchronization of a local folder of audio files with an online bucket that
supports URL shortening, sharing tools, and a slick, personalized domain.

**See this app on the web:** https://makes.audio

_At the moment, an invite code is required to join the production app._

## Goals

In the wake of Dropbox removing support for public folders, it's tricky to find
a comparable tool for managing and sharing quick demos, snippets, or full audio
tracks with friends and fans. Sites like clyp.it and instaud.io are feature-rich
and provide high availability, but may sacrifice quality and customization.

1. Focus on personalization
1. An intuitive and pleasant UI
1. Ease of organization

The goals of **makes.audio** are not to provide a platform for discovery,
everyday streaming, or personal expression.

## Tech

**makes.audio** is an API-driven Node/Express application. The frontend is
a Vue/Redux application written in Coffescript. The goal is to ship objects to
S3.

## Development

Node v8+ is required.

To run locally, clone and install dependencies:

```shell
git clone git@github.com:austindebruyn/makes.audio
cd makes.audio
npm i -g yarn
yarn
```

To set up the database locally, make sure you install MySQL separately.

```shell
node bin/createDatabase
node bin/migrate
```

To run the server:

```shell
npm i -g nodemon
nodemon
```

The app will listen on https://localhost:3000.

To build the frontend:

```shell
npm run build
```

For everyday development, `npm run watch` and `nodemon` in separate tabs are
recommended.

## Tests

For backend unit tests:

```shell
yarn test:api
```

For frontend unit tests:

```shell
yarn test:ui
```

For the integration suite, you will need to ensure that:
1. You have placed `127.0.0.1 test-makes.audio` in your hostfile
1. You are running a Selenium server locally.

```shell
yarn test:integration
```

## License

All rights reserved.
