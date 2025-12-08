// Component to display full article content
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getArticleById } from '../../api/articlesApi';
import Spinner from '../../components/ui/Spinner';
import { formatDate } from '../../lib/date';
import { Link } from 'react-router-dom';
import placeholderImage from '../../assets/placeholder.jpg';
import './ArticleDetail.css';

const ArticleDetail = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                setLoading(true);
                const fetchedArticle = await getArticleById(id);
                setArticle(fetchedArticle);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [id]);

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return <div className="article-container">Error: {error}</div>;
    }

    if (!article) {
        return <div className="article-container">Article not found.</div>;
    }

    return (
        <div className="article-container">
            <div className="article-header">
                <Link className="blog-header " to="/">Bloggy - McBlog</Link>
                <h1>{article.title}</h1>
                <span className='card-date'>Published on: {formatDate(article.publishDate)}</span>
            </div>
            <div className="article-content">{article.content}</div>
            <img className="article-image" src={article.image ? article.image : placeholderImage} alt={article.title} />
        </div>
    );
};

export default ArticleDetail;
