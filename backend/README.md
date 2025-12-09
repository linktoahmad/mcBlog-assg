# Backend Service

This directory contains the Node.js backend for the blog application. It's a RESTful API built with Express that handles article management, AI-powered content generation, and background job processing.

## Tech Stack

- **Framework**: [Express.js](https://expressjs.com/) (`~4.18.2`)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Sequelize](https://sequelize.org/) (`~6.37.3`) for object-data mapping.
- **Job Queue**: [pg-boss](https://github.com/timgit/pg-boss) (`~9.0.3`) for managing background jobs using PostgreSQL.
- **AI Integration**:
    - [@openrouter/ai-sdk-provider](https://www.npmjs.com/package/@openrouter/ai-sdk-provider): For generating article content.
    - [@google/genai](https://www.npmjs.com/package/@google/genai): For generating images related to articles.
- **Validation**: [express-validator](https://express-validator.github.io/docs/) (`~7.3.1`) for validating incoming request bodies.

## Architecture

The backend follows a layered architecture to separate concerns:

1.  **Routes Layer (`src/routes`)**: This is the entry point for all API requests. It defines the API endpoints and maps them to the appropriate controller functions (which are part of the services layer in this implementation). It also wires up middleware for validation.

2.  **Service Layer (`src/services`)**: This layer contains the core business logic of the application. It's responsible for orchestrating operations, interacting with the database (via the models), and invoking other services or workers.

3.  **Data Access Layer (`src/models`)**: This layer is responsible for all interactions with the database. It uses Sequelize to define the data models and perform CRUD operations.

### Background Job Processing

The application uses `pg-boss` to handle long-running tasks in the background, preventing API requests from timing out.

- **Scheduling**: Jobs can be scheduled to run at a specific time or on a recurring basis (cron jobs). The `articleJob.js` service is an example of a cron job.
- **Queueing**: When a task needs to be performed asynchronously (like generating an article), a job is published to a queue.
- **Workers**: A worker process (`src/workers/`) listens for new jobs on a specific queue. When a job is received, the worker executes the task. This is a pull-based system.

## Project Structure

```
backend/src/
├── config/
│   ├── database.js     # Sequelize database connection and model initialization
│   └── queue.js        # pg-boss job queue initialization
├── index.js            # Application entry point: starts the Express server and services
├── middleware/
│   └── validationMiddleware.js # Middleware to handle validation errors from express-validator
├── models/
│   └── Article.js      # Sequelize model definition for the 'Article' table
├── routes/
│   ├── articlesRoutes.js # API routes for managing articles
│   └── jobsRoutes.js     # API routes for inspecting jobs
├── services/
│   ├── articleJob.js     # Cron job service to schedule daily article generation
│   ├── articleService.js # Business logic for articles (CRUD, AI generation)
│   ├── jobService.js     # Logic for retrieving job statuses
│   └── startupService.js # Service to initialize all other services and jobs
├── utils/
│   └── errorHandler.js   # Centralized error handling logic
├── validators/
│   └── articleValidator.js # Validation rules for article-related requests
└── workers/
    └── articleWorker.js  # Worker that processes article generation jobs
```

## API Endpoints

| Method   | Endpoint                | Validations / Body                                                                                                                                                            | Description                                                                        |
| :------- | :---------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------- |
| `GET`    | `/api/articles`         | **Query Params:**<br/>- `page` (optional): Must be a positive integer.<br/>- `limit` (optional): Must be an integer between 1 and 50.                                           | Retrieves a paginated list of all articles.                                        |
| `GET`    | `/api/articles/:id`     | **Path Parameter `id`**: Must be a positive integer.                                                                                                                         | Retrieves a single article by its ID.                                              |
| `POST`   | `/api/articles/generate`| **Body:**<br/>- `topic` (optional): A string to guide the AI article generation. If omitted, a random topic will be used. | Triggers a background job to generate a new article using AI. This is asynchronous. |
| `GET`    | `/api/jobs`             | N/A                                                                                                                                                                           | Retrieves the status of all jobs in the `pg-boss` queue.                           |

## Services Deep Dive

### `articleService.js`

-   **`getAllArticles()`**: Fetches all articles from the database.
-   **`getArticleById(id)`**: Fetches a single article by its ID.
-   **`generateArticle()`**: This is the core function for AI content generation. It gets a random topic, uses the OpenRouter SDK to generate the article text, uses the Google GenAI SDK to generate a related image, and then saves the new article to the database.
-   **`createArticleGenerationJob()`**: Publishes a new job to the 'generate-article' queue, which will be picked up by the `articleWorker`.

### `jobService.js`

-   **`getJobs()`**: Interacts with `pg-boss` to get a list of all jobs, their states (e.g., created, active, completed, failed), and other metadata.

### `articleJob.js`

-   **`scheduleArticleGeneration()`**: Sets up a cron job using `pg-boss` that runs daily. This cron job is configured to call `articleService.createArticleGenerationJob()`, ensuring that a new article is automatically generated every day.

### `startupService.js`

-   **`start()`**: This is a crucial service that is called when the application starts. It's responsible for initializing the database connection, starting the `pg-boss` instance, and scheduling the cron job from `articleJob.js`.

## Workers Deep Dive

### `articleWorker.js`

-   **`start()`**: This function initializes the worker. It subscribes to the 'generate-article' queue.
-   **Job Processing**: When a job appears on the queue, the worker picks it up and executes the `articleService.generateArticle()` function. This ensures that the time-consuming AI generation process does not block the main application thread.

## Database

The application uses a single Sequelize model:

### `Article` (`src/models/Article.js`)

-   **`id`**: `UUID`, Primary Key.
-   **`title`**: `STRING`.
-   **`content`**: `TEXT`.
-   **`imageUrl`**: `STRING`.
-   **`createdAt`**: `DATE`.
-   **`updatedAt`**: `DATE`.

The database connection is configured in `src/config/database.js`, which reads the `DATABASE_URL` from the environment variables.

## Getting Started

### Prerequisites

-   Node.js (v18 or higher recommended)
-   npm
-   A running PostgreSQL instance

### Installation and Setup

1.  **Navigate to the backend directory:**

    ```bash
    cd backend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Create a `.env` file** in the `backend` directory. It needs to contain the connection string for your PostgreSQL database and your AI service API keys.

    ```
    # Example for a local PostgreSQL instance
    DATABASE_URL=postgres://user:password@localhost:5432/database_name

    # API Keys
    OPENROUTER=your_openrouter_api_key
    GEMINI_API_KEY=your_gemini_api_key
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

The API will be available at `http://localhost:3001`. The server will automatically restart when you make changes to the code.