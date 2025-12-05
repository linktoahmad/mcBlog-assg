const { Sequelize } = require('sequelize');
const ArticleModel = require('../models/Article');
require('dotenv').config()

let sequelize;

sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: false  // ← DISABLE SSL for Docker Postgres!
  },
  logging: process.env.NODE_ENV === 'development' ? console.log : false
});



const Article = ArticleModel(sequelize);

module.exports = { sequelize, Article };