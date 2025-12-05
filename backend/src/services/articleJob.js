const cron = require('node-cron');
const { generateArticle } = require('./articleService');

const scheduleDailyArticleGeneration = () => {
  // Daily cron job - 9 AM
  cron.schedule('0 9 * * *', async () => {
    console.log('Generating daily article...');
    try {
      const article = await generateArticle();
      console.log(`Daily article generated: ${article.title}`);
    } catch (error) {
      console.error('Daily article generation failed:', error);
    }
  });
};

module.exports = { scheduleDailyArticleGeneration };
