import PgBoss from 'pg-boss';
import 'dotenv/config';
import { handleError } from '../utils/errorHandler.js';

const boss = new PgBoss(process.env.DATABASE_URL);
boss.on('error', error => handleError(error, 'PG Boss'));

export default boss;
