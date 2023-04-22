# ScholarBot

Currently just a little project to display paper information, link researcher accounts with verification, and record / notify upcoming events.

Only has some doi support currently, though I plan on updating it more in the future. Probably add support for slack and zoom too along with discord.

## Current Requirements

* Node 19.8.1
* npm 9.5.1

## Environment File (.env)

This is needed to run the bot.

```
DISCORD_CLIENT_ID=<discord_client_id>
DISCORD_TOKEN=<discord_token>
SLACK_HOST=<host> (e.g. slack looks for /doi POST endpoint)
SLACK_PORT=<port>
```

## Useful Commands

### Setup project

```sh
npm install
```

### Run discord bot

```sh
npm run discord
```

### Run slack bot

The slack bot registers a slash command in the api. The slash command looks for a request url, so you will need to use something like [`ngrok`](https://ngrok.com/) to map localhost to a public url. The endpoint used within this example is `/doi`.

```sh
npm run slack
```

### Run linter

Runs linter for all files in the `./src` directory.

```sh
npm run lint
```

### Run examples

Runs the DOI from ACMDL discord example, assuming the `.env` file has been added.

```sh
npm run example:discord
```


