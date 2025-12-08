import express from 'express';
import cors from 'cors';
import { sequelize, Article } from './config/database.js';
import articlesRouter from './routes/articlesRoutes.js';
import boss from './config/queue.js';
import { scheduleDailyArticleGeneration } from './services/articleJob.js';
import { generateArticleJob } from './workers/articleWorker.js';
import { handleError } from './utils/errorHandler.js';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

// console every request
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/articles', articlesRouter);
app.get('/api/health', async (req, res) => {
  try {
    const count = await Article.count();
    res.json({ 
      status: 'healthy', 
      db: sequelize.connectionManager.hasListeners ? 'connected' : 'disconnected',
      articles: count 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'unhealthy', 
      db: 'disconnected',
      error: error.message
    });
  }
});


// Start server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    await sequelize.sync({ alter: true }); // Use migrations in production
    console.log('Database synchronized.');
    await boss.start();
    console.log('PG Boss started');
    boss.work('generate-article', generateArticleJob);
    console.log('PG Boss worker registered for generate-article');
    // Schedule cron jobs
    await scheduleDailyArticleGeneration();
    console.log('PG Boss cron job scheduler running');
    
    app.listen(process.env.PORT || 3001, () => {
      console.log(`Server running on port ${process.env.PORT || 3001}`);
    });
  } catch (error) {
    handleError(error, 'Startup');
  }
};

startServer();