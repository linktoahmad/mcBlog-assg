import { Article } from '../config/database.js';

export const getArticles = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  return await Article.findAndCountAll({
    attributes: ['id', 'title', 'summary', 'publishDate', 'image'],
    order: [['publishDate', 'DESC']],
    limit,
    offset,
  });
};

export const getArticleById = async (id) => {
  return await Article.findByPk(id);
};

