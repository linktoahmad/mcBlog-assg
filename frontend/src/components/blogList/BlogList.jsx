// Page to display blog articles
import { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getArticles, generateArticle } from '../../api/articlesApi';
import BlogCard from "../../components/blog/BlogCard";
import { useNavigate } from 'react-router-dom';
import BlogButton from '../blogButton/BlogButton';
import Spinner from '../../components/ui/Spinner';

const BlogList = () => {
    const [articles, setArticles] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const fetchArticles = async (isNew = false) => {
        try {
            setIsLoading(true);
            const response = await getArticles(page, 10);
            setArticles(isNew ? response.articles : [...articles, ...response.articles]);
            setHasMore(response.pagination.page < response.pagination.pages);
            if (isNew) setPage(2);
            else setPage(page + 1);
            setIsLoading(false);
        } catch (error) {
            console.error('Failed to fetch articles:', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const handleArticleClick = (article) => {
        navigate(`/article/${article.id}`);
    };

    return (

        <div className="blog-list">
                <InfiniteScroll
                    dataLength={articles.length}
                    next={() => fetchArticles()}
                    hasMore={hasMore}
                    loader={<Spinner />}
                    endMessage={
                        <div className='section-footer'>
                            <b>Yay! You have seen it all</b>
                           <BlogButton />
                        </div>}>
                    {articles.map((article, index) => (
                        <div className="blog-list" onClick={() => handleArticleClick(article)}>
                            <BlogCard
                                key={index}
                                summary={article.summary}
                                date={article.publishDate}
                                title={article.title}
                                image={article.image}
                            />
                        </div>
                    ))}
                </InfiniteScroll>
        </div>
    );
};

export default BlogList;