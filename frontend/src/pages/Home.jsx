// Page to display blog articles
import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getArticles, generateArticle } from '../api/client';
import BlogCard from "../components/Blog/BlogCard";
import './Home.css';
import { Link, useNavigate } from 'react-router-dom';
import Spinner from '../components/ui/Spinner';

const Home = () => {
    const [articles, setArticles] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const navigate = useNavigate();

    const fetchArticles = async (isNew = false) => {
        try {
            const response = await getArticles(isNew ? 1 : page, 10);
            setArticles(isNew ? response.articles : [...articles, ...response.articles]);
            setHasMore(response.pagination.page < response.pagination.pages);
            if (isNew) setPage(2);
            else setPage(page + 1);
        } catch (error) {
            console.error('Failed to fetch articles:', error);
        }
    };

    useEffect(() => {
        fetchArticles(true);
    }, []);

    const handleGenerate = async () => {
        try {
            await generateArticle();
            fetchArticles(true);
        } catch (error) {
            console.error('Failed to generate article:', error);
        }
    };

    const handleArticleClick = (article) => {
        navigate(`/article/${article.id}`);
    };

    return (
        <section className="blog-section">
            <div className="blog-intro">
                <Link className="blog-header " to="/">Bloggy - McBlog</Link>
                <h2 className="blog-title">How you doin...</h2>
                <p className="blog-description">
                    Read the blogs written by cranker. <br />
                    Infite scoll so you dont have to manually move to next page,
                    and when you get bored of reading click the button to generate new a blog.
                </p>
                <button className="blog-cta" onClick={handleGenerate}>
                    Make new blog <span>&rarr;</span>
                </button>
            </div>
            <div className="blog-list">
                <InfiniteScroll
                    dataLength={articles.length}
                    next={() => fetchArticles()}
                    hasMore={hasMore}
                    loader={<Spinner />}
                    endMessage={
                        <div className='section-footer'>
                            <b>Yay! You have seen it all</b>
                            <button className="blog-cta" onClick={handleGenerate}>
                                Make new blog
                                <span>&rarr;</span>
                            </button>
                        </div>}>
                    {articles.map((article, index) => (
                        <div className="blog-list" onClick={() => handleArticleClick(article)}>
                            <BlogCard
                                key={index}
                                summary={article.summary}
                                date={article.publishDate}
                                title={article.title}
                            />
                        </div>
                    ))}
                </InfiniteScroll>
            </div>
        </section>
    );
};

export default Home;