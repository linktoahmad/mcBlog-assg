import { sequelize } from '../config/database.js';
import { QueryTypes } from 'sequelize';

export const getJobs = async () => {
  try {
    const jobs = await sequelize.query('SELECT * FROM pgboss.job', { type: QueryTypes.SELECT });
    return jobs;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw new Error('Error fetching jobs');
  }
};
