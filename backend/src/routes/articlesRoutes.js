import express from 'express';
import { getArticles, getArticleById } from '../services/articleService.js';
const router = express.Router();
import { getArticlesValidator, getArticleByIdValidator, generateArticleValidator } from '../validators/articleValidator.js';
import { handleValidationErrors } from '../middleware/validationMiddleware.js';
import { handleError } from '../utils/errorHandler.js';

router.get('/', getArticlesValidator, handleValidationErrors, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const { count, rows } = await getArticles(page, limit);
    res.json({
      articles: rows,
      pagination: { page, limit, total: count, pages: Math.ceil(count / limit) }
    });
  } catch (error) {
    handleError(error, 'Get Articles Route');
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

router.get('/:id', getArticleByIdValidator, handleValidationErrors, async (req, res) => {
  try {
    const article = await getArticleById(req.params.id);
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json(article);
  } catch (error) {
    handleError(error, 'Get Article By ID Route');
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

import boss from '../config/queue.js';

router.post('/generate', generateArticleValidator, handleValidationErrors, async (req, res) => {
  try {
    const { topic = null } = req.body;
    await boss.send('generate-article', { topic }); // Enqueue the job
    res.status(202).json({ message: 'Article generation job enqueued.' });
  } catch (error) {
    handleError(error, 'Generate Article Route');
    res.status(500).json({ error: 'Failed to enqueue article generation job' });
  }
});

export default router;