import boss from '../config/queue.js';

const cronSchedule = '0 9 * * *'; // 9 AM daily
const jobName = 'generate-article';

export const scheduleDailyArticleGeneration = async () => {
  await boss.schedule(jobName, cronSchedule);
  console.log(`Job '${jobName}' scheduled with cron: '${cronSchedule}'`);
};