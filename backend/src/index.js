const express = require('express');
const { sequelize, Article } = require('./config/database');
const articlesRouter = require('./routes/articles');
const { generateArticle } = require('./services/articleService');
const { scheduleDailyArticleGeneration } = require('./services/articleJob');
require('dotenv').config()

const app = express();
app.use(express.json());

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

// Seed on startup
const seedArticles = async () => {
  const count = await Article.count();
  if (count === 0) {
    console.log('Seeding initial articles...');
    await generateArticle();
    await generateArticle();
    await generateArticle();
  }
};

// Start server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    await sequelize.sync({ alter: true }); // Use migrations in production
    console.log('Database synchronized.');
    await seedArticles();
    scheduleDailyArticleGeneration();
    app.listen(process.env.PORT || 3001, () => {
      console.log(`Server running on port ${process.env.PORT || 3001}`);
    });
  } catch (error) {
    console.error('Startup failed:', error);
  }
};

startServer();