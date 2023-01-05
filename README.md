# POC NestJS API

This projet is a server-side Todo application.

## Architecture

The project use a hexagonal architecture.

### Domain

The `domain` folder contain the business logic of the app.

#### Usecases

In `usecases` folder, there are some actions which can be execute, such as add todo, remove todo or list all todos.

#### Ports

In `ports` folder, there is the contract the secondaries adapters have to implement.

#### Entities

`entities` folder contains the entities use by the application, returned to the primaries adapters

### Adapters

The `adapters` folder contains two sub-directories : `primaries` and `secondaries`

#### Primaries adapters

This folder contains the components which use the business logic. It could be a UI, a console. In this project, it is the routes exposed by the api, as known as `controller` in NestJS framework.

#### Secondaries adapters

This folder contains the components the business part need to use. In this projet, it contains adapters which implement `ports` contracts for managing Todo. In first time I built all my app with a InMemory adapter, only storing datas into an array. Then I added a Database adapter.

## Technologies

The back-end is developp with [NestJs](https://docs.nestjs.com/) framework. The database secondary adapter is a [Postgres](https://www.postgresql.org/) database, manage with [TypeORM](https://typeorm.io/) (version 0.3.X). I use [PGAdmin](https://www.pgadmin.org/) for browse database records.

I also use [Docker](https://docs.docker.com/) for building and deploying the NestJs app [Docker-compose](https://docs.docker.com/compose/compose-file/) for communication between NestJs app and Database, for deploying a PGAdmin instance for viewing datas.

## Run

1. Create a `.env` file based on `.env.template`
2. Run `npm ci` for installing all dependencies
3. Run `docker-compose up` for downloading and starting all docker container
4. Run `docker exec poc-nestjs-app npm run typeorm:run` for creating database tables

## Test

You can run unit test executing `npm run test`
