# Web App Backend

This is a [NestJS](http://nestjs.com/) app to receive contact form submissions and store them in a MySQL database.

## Running Locally

You'll need to have docker installed to run the database containers and pnpm to install the project dependencies.

```bash
# install dependencies
$ pnpm install

# start the development and test databases
$ docker compose up -d

# start the app in development mode
$ pnpm start:dev
```

## Run Tests

Make sure the test db is live (`$ docker compose up -d`)

```bash
# run e2e tests
$ pnpm test:e2e

# or while developing run run e2e tests in watch mode
$ pnpm test:e2e:watch
```

## Seed DB

Seed the development DB with some test data. Useful if you're working on the front end.

```bash
$ pnpm seed:dev
```

## Clean DB

Reset the DB removing and reinitializing all tables

```bash
$ pnpm clean:dev
```
