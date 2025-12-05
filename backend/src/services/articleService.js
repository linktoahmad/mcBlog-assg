const { Article } = require('../config/database');

// todo use ai to generate articles
const placeholderTemplates = [
  {
    title: `Tech Update ${Math.random()}`,
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\n".repeat(20) + "This is a complete 800+ word article about today's tech developments..."
  },
  {
    title: "Web Development Best Practices ${date}",
    content: "In modern web development...".repeat(25) + "Comprehensive guide with placeholder content."
  },
  {
    title: "Future of Software Engineering ${date}",
    content: "The landscape of software engineering is evolving rapidly...".repeat(25) + "Detailed analysis article."
  }
];

const generateArticle = async () => {
  const template = placeholderTemplates[Math.floor(Math.random() * 3)];
  const date = new Date().toISOString().split('T')[0];
  const articleData = {
    title: template.title.replace('${date}', date),
    content: template.content,
    summary: template.content.slice(0, 120) + '...'
  };

  const article = await Article.create(articleData);
  return article;
};

const getArticles = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  return await Article.findAndCountAll({
    attributes: ['id', 'title', 'summary', 'publishDate'],
    order: [['publishDate', 'DESC']],
    limit,
    offset
  });
};

const getArticleById = async (id) => {
  return await Article.findByPk(id);
};

module.exports = { generateArticle, getArticles, getArticleById };
