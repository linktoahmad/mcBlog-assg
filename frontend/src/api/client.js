// API client for interacting with the backend

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const API_URL = `${API_BASE_URL}/api/articles`;

export const getArticles = async (page = 1, limit = 10) => {
    const response = await fetch(`${API_URL}?page=${page}&limit=${limit}`);
    if (!response.ok) {
        throw new Error('Failed to fetch articles');
    }
    return response.json();
};

export const getArticleById = async (id) => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch article');
    }
    return response.json();
};

export const generateArticle = async () => {
    const response = await fetch(`${API_URL}/generate`, {
        method: 'POST',
    });
    if (!response.ok) {
        throw new Error('Failed to generate article');
    }
    return response.json();
};
