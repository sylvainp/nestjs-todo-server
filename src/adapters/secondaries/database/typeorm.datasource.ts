import { DataSource } from 'typeorm';
import TypeOrmConfig from './typeorm.config';

const AppTypeOrmDatasource = new DataSource(TypeOrmConfig);

export default AppTypeOrmDatasource;
