const TypeOrmConfig: any = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'postgres-db-fallback',
  port: +process.env.POSTGRES_PORT || 5432,
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'tododb',
  entities: [`${__dirname}/entities/*`],
  migrationsRun: false,
  logging: true,
  migrationsTableName: 'migration_table_name',
  migrations: [`${__dirname}/migrations/*`],
  synchronize: false,
};
export default TypeOrmConfig;
