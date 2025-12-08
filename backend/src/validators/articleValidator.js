import { query, param, body } from 'express-validator';

export const getArticlesValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be an integer between 1 and 50')
];

export const getArticleByIdValidator = [
  param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer')
];

export const generateArticleValidator = [
  body('topic').optional().isString().withMessage('Topic must be a string')
];

