# Frontend: Blog Application

This directory contains the frontend of the blog application, a single-page application (SPA) built with React. It provides the user interface for browsing articles, viewing article details, and seeing the status of backend jobs.

## Tech Stack

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

- **Framework**: [React](https://reactjs.org/) (`~19.2.1`)
- **Build Tool**: [React Scripts](https://www.npmjs.com/package/react-scripts) (`5.0.1`)
- **Routing**: [React Router](https://reactrouter.com/) (`~7.10.1`) for client-side routing.
- **Scrolling**: [React Infinite Scroll Component](https://www.npmjs.com/package/react-infinite-scroll-component) (`~6.1.1`) for efficiently loading articles as the user scrolls.
- **Styling**: Standard CSS, with stylesheets co-located with their respective components.


### Component Structure

The components are organized into two main categories:

-   **`pages/`**: These are top-level components that correspond to a specific route (e.g., `/`, `/article/:id`). They are responsible for fetching data and managing the overall state of the page.
-   **`components/`**: These are smaller, reusable components that are used to build the pages. They receive data via props and are primarily concerned with rendering UI. This includes both general UI elements (`ui/`) and more complex, domain-specific components (`blogCard/`, `blogList/`).

### Routing

Client-side routing is handled by `react-router-dom`. The main routes are defined in `src/App.js`, which maps URL paths to their corresponding page components. This allows for a seamless navigation experience without full-page reloads.

## Project Structure

```

    frontend/                           # React frontend application
    ├── .gitignore                      # Git ignore rules for frontend
    ├── Dockerfile                      # Dockerfile for the frontend service
    ├── nginx.conf                      # Nginx configuration for serving the frontend
    ├── package-lock.json               # Lock file for npm dependencies
    ├── package.json                    # Frontend dependencies and scripts
    └── src/                            # Frontend source code
        ├── App.css                     # Main application CSS
        ├── App.js                      # Main application component
        ├── index.css                   # Global styles
        ├── index.js                    # Entry point for the React application
        ├── api/                        # API client for interacting with the backend
        │   ├── articlesApi.js          # API calls for articles
        │   └── jobsApi.js              # API calls for jobs
        ├── assets/                     # Frontend specific assets
        ├── components/                 # Reusable React components
        │   ├── blogButton/             # Blog button component
        │   │   ├── BlogButton.css      # Styles for BlogButton
        │   │   └── BlogButton.jsx      # BlogButton React component
        │   ├── blogCard/               # Blog card component
        │   │   ├── BlogCard.css        # Styles for BlogCard
        │   │   └── BlogCard.jsx        # BlogCard React component
        │   ├── blogList/               # Blog list component
        │   │   ├── BlogList.css        # Styles for BlogList
        │   │   └── BlogList.jsx        # BlogList React component
        │   └── ui/                     # UI components
        │    ├── Spinner.css         # Styles for Spinner
        │    └── Spinner.jsx         # Spinner React component
        ├── lib/                        # Utility functions
        │   └── date.js                 # Date utility functions
        └── pages/                      # Page-level React components
            ├── 404/                    # 404 Not Found page
            │   ├── NotFound.css        # Styles for 404 page
            │   └── NotFound.jsx        # 404 Not Found React component
            ├── articleDetails/         # Article details page
            │   ├── ArticleDetail.css   # Styles for ArticleDetail page
            │   └── ArticleDetail.jsx   # ArticleDetail React component
            ├── home/                   # Home page
            │   ├── Home.css            # Styles for Home page
            │   └── Home.jsx            # Home page React component
            └── jobs/                   # Jobs page
                ├── Jobs.css            # Styles for Jobs page
                └── Jobs.jsx            # Jobs page React component
```

## Available Scripts

In the `frontend` directory, you can run:

### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits. You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes. Your app is ready to be deployed!

## Getting Started

1.  **Navigate to the frontend directory:**

    ```bash
    cd frontend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Create a `.env` file** in the `frontend` directory with the following content, pointing to your backend's URL:

    ```
    REACT_APP_API_URL=http://localhost:3001
    ```

4.  **Run the development server:**

    ```bash
    npm start
    ```
