# Tips for updating TypeORM model with CLI

When new Entities have been created, you can generate TypeORM migration file with TypeORM Cli.

1. Start server with following command : `docker-compose up`
2. Then, run this command for generate migration file `docker exec <CONTAINER_ID> npm run typeorm:generate src/adapters/secondaries/database/migrations/<MIGRATION_FILE_NAME>`

Executing the command `docker ps` for getting `poc_nestjs_api-nestjs` container id.

Example :

``` 
docker exec c4b9e0726f4c npm run typeorm:generate src/adapters/secondaries/database/migrations/AddUserEntity
```

3. You can now run `docker exec <CONTAINER_ID> npm run typeorm:run` for executing migration
