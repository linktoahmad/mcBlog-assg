const express = require('express');
const { generateArticle, getArticles, getArticleById } = require('../services/articleService');
const router = express.Router();
const { getArticlesValidator, getArticleByIdValidator } = require('../validators/articleValidator');
const { handleValidationErrors } = require('../middleware/validationMiddleware');

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
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

router.get('/:id', getArticleByIdValidator, handleValidationErrors, async (req, res) => {
  try {
    const article = await getArticleById(req.params.id);
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

router.post('/generate', async (req, res) => {
  try {
    const article = await generateArticle();
    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate article' });
  }
});

module.exports = router;