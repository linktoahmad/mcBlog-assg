import { useState } from 'react';
import { generateArticle } from '../../api/articlesApi';
import './BlogButton.css';

const BlogButton = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [buttonText, setButtonText] = useState("Make new blog");

    const handleGenerate = async () => {
        try {
            setIsLoading(true);
            await generateArticle();
            setButtonText("Blog Queued!");
        } catch (error) {
            console.error('Failed to generate article:', error);
            setButtonText("Error! Try Again");
        } finally {
            setIsLoading(false);
               setTimeout(() => {
                setButtonText("Make new blog");
            }, 5000);
        }
    };

    return (
        <button className="blog-cta" onClick={handleGenerate}>
            {buttonText} <span>&rarr;</span>
        </button>
    );
};

export default BlogButton;