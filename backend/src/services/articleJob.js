import boss from '../config/queue.js';

const cronSchedule = '0 9 * * *'; // 9 AM daily
//const cronSchedule = '*/1 * * * *'; // TEST: Every minute
const jobName = 'generate-article';

export const scheduleDailyArticleGeneration = async () => {
  await boss.schedule(jobName, cronSchedule, { daily: true });
  console.log(`Cron scheduled: ${cronSchedule}`, new Date());
};