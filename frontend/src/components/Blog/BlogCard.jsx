import React from 'react';
import './BlogCard.css';
import { formatDate } from '../../lib/date';
import placeholderImage from '../../assets/placeholder.jpg';

const BlogCard = ({ summary, date, title, image }) => {
  return (
    <div className="blog-card">
      <div className='card-inner'>
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
        <img
          className="card-image"
          src={image ? image : placeholderImage}
          alt={title} />
      </div>
    </div>
  );
};

export default BlogCard;
