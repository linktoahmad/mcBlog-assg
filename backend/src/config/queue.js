import PgBoss from 'pg-boss';
import 'dotenv/config';
import { handleError } from '../utils/errorHandler.js';

const boss = new PgBoss({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
  poolSize: 10
});
boss.on('error', error => handleError(error, 'PG Boss'));

export default boss;
