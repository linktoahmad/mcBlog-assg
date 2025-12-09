import { Article } from '../config/database.js';
import boss from '../config/queue.js';
import { handleError } from '../utils/errorHandler.js';


export const seedInitialArticles = async () => {
  try {
    const articleCount = await Article.count();
    if (articleCount === 0) {
      console.log('No articles found. Seeding database with 3 articles...');
  
      await Promise.all([
        boss.send('generate-article', { topic: 'a surprising fact about ancient rome' }),
        boss.send('generate-article', { topic: 'the future of space exploration' }),
        boss.send('generate-article', { topic: 'a simple recipe for a healthy meal' })
      ]);
      console.log('Enqueued 3 article generation jobs.');
    } else {
      console.log(`${articleCount} articles found. Skipping database seed.`);
    }
  } catch (error) {
    handleError(error, 'Seed Initial Articles');
  }
};
