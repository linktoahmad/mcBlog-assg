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
        <div className="blog-button-container">
            <button className="blog-cta" onClick={handleGenerate}>
                {buttonText} <span>&rarr;</span>
            </button>
            <div className="tooltip">
                <span className="info-icon">i</span>
                <span className="tooltiptext">
                    The Daily blog goes live at 9 AM. New blogs are queued and released as soon as they are cooked.
                </span>
            </div>
        </div>
    );
};

export default BlogButton;