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
```

## Useful Commands

### Setup project

```sh
npm install
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
