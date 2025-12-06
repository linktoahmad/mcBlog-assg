import React from 'react';
import './BlogCard.css';
import { formatDate } from '../../lib/date';

const BlogCard = ({ summary, date, title }) => {
  return (
    <div className="blog-card">
      <div className="card-content">
        <div className="card-meta">
          <h3 className="card-title">{title}</h3>
          <div className='date-field'>
            <span className="card-separator">•</span>
            <span className="card-date">{formatDate(date)}</span>
          </div >
        </div>
        <span className="card-category">{summary}</span>
      </div>
      <div className="card-link-icon">
        <span>↗</span>
      </div>
    </div>
  );
};

export default BlogCard;
