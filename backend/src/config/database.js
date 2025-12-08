import { Sequelize } from 'sequelize';
import ArticleModel from '../models/Article.js';
import 'dotenv/config';

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

export { sequelize, Article };