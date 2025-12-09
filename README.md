# Full Stack Blog Application

This is a full-stack blog application with a React frontend, a Node.js backend, and a PostgreSQL database. The application is containerized using Docker and deployed on AWS.
## Features

- Modern responsive design react 19
- Infinite scroll article
- Jobs board
- Daily new Ai generated article
- Make new Ai generated article
- Jobs queuing
- Dockerized backend and frontend

## Tech Stack

- **React**  user interface library 
- **react-infinite-scroll-component**  Efficient article pagination
- **react-router-dom**  Smooth client-side navigation
- **Node.js** JavaScript Runtime Environment
- **Express**  Node.js web application framework 
- **Axios**  Client for Http
- **Sequelize**  PostgreSQL ORM 
- **PostgreSQL**  Database
- **pg-boss**  Reliable job queue scheduling
- **@openrouter/ai-sdk-provider** AI text generation (tngtech/deepseek-r1t2-chimera:free)
- **@google/genai**  generate blog images
- **Docker** Containerized deployment

### Infrastructure

- **AWS EC2:** The application is deployed on an EC2 instance.
- **AWS ECR:**- Container registry
- **AWS CodeBuild:** Used for building the application.
- **GitHub Actions:** For CI/CD.



## File Structure

```
.
├── .github/                            # GitHub Actions workflows for CI/CD
│   └── workflows/                      # Workflow definitions
│       └── deploy-ec2.yml              # Workflow for deploying to EC2
├── backend/                            # Node.js backend application
│   ├── .gitignore                      # Git ignore rules for backend
│   ├── Dockerfile                      # Dockerfile for the backend service
│   ├── package-lock.json               # Lock file for npm dependencies
│   ├── package.json                    # Backend dependencies and scripts
│   └── src/                            # Backend source code
│       ├── index.js                    # Application entry point
│       ├── config/                     # Database and queue configuration
│       │   ├── database.js             # Database connection setup
│       │   └── queue.js                # Job queue configuration
│       ├── middleware/                 # Express middleware
│       │   └── validationMiddleware.js # Request validation middleware
│       ├── models/                     # Sequelize database models
│       │   └── Article.js              # Article model definition
│       ├── routes/                     # API route definitions
│       │   ├── articlesRoutes.js       # API routes for articles
│       │   └── jobsRoutes.js           # API routes for jobs
│       ├── services/                   # Business logic
│       │   ├── articleJob.js           # Service for article-related jobs
│       │   ├── articleService.js       # Service for article business logic
│       │   ├── jobService.js           # Service for job business logic
│       │   └── startupService.js       # Application startup service
│       ├── utils/                      # Utility functions
│       │   └── errorHandler.js         # Centralized error handling
│       ├── validators/                 # Request data validation schemas
│       │   └── articleValidator.js     # Validator for article data
│       └── workers/                    # Background job workers
│           └── articleWorker.js        # Worker for processing article generation jobs
├── frontend/                           # React frontend application
│   ├── .gitignore                      # Git ignore rules for frontend
│   ├── Dockerfile                      # Dockerfile for the frontend service
│   ├── nginx.conf                      # Nginx configuration for serving the frontend
│   ├── package-lock.json               # Lock file for npm dependencies
│   ├── package.json                    # Frontend dependencies and scripts
│   └── src/                            # Frontend source code
│       ├── App.css                     # Main application CSS
│       ├── App.js                      # Main application component
│       ├── index.css                   # Global styles
│       ├── index.js                    # Entry point for the React application
│       ├── api/                        # API client for interacting with the backend
│       │   ├── articlesApi.js          # API calls for articles
│       │   └── jobsApi.js              # API calls for jobs
│       ├── assets/                     # Frontend specific assets
│       ├── components/                 # Reusable React components
│       │   ├── blogButton/             # Blog button component
│       │   │   ├── BlogButton.css      # Styles for BlogButton
│       │   │   └── BlogButton.jsx      # BlogButton React component
│       │   ├── blogCard/               # Blog card component
│       │   │   ├── BlogCard.css        # Styles for BlogCard
│       │   │   └── BlogCard.jsx        # BlogCard React component
│       │   ├── blogList/               # Blog list component
│       │   │   ├── BlogList.css        # Styles for BlogList
│       │   │   └── BlogList.jsx        # BlogList React component
│       │   └── ui/                     # UI components
│       │       ├── Spinner.css         # Styles for Spinner
│       │       └── Spinner.jsx         # Spinner React component
│       ├── lib/                        # Utility functions
│       │   └── date.js                 # Date utility functions
│       └── pages/                      # Page-level React components
│           ├── 404/                    # 404 Not Found page
│           │   ├── NotFound.css        # Styles for 404 page
│           │   └── NotFound.jsx        # 404 Not Found React component
│           ├── articleDetails/         # Article details page
│           │   ├── ArticleDetail.css   # Styles for ArticleDetail page
│           │   └── ArticleDetail.jsx   # ArticleDetail React component
│           ├── home/                   # Home page
│           │   ├── Home.css            # Styles for Home page
│           │   └── Home.jsx            # Home page React component
│           └── jobs/                   # Jobs page
│               ├── Jobs.css            # Styles for Jobs page
│               └── Jobs.jsx            # Jobs page React component
├── docs/                               # Project documentation and assets
│   └── assets/                         # Images and diagrams for documentation
│       ├── architecture.md             # Architecture overview
│       ├── home.png                    # Screenshot of the home page
│       └── jobsBard.png                # Screenshot of the jobs board
└── infra/                              # Infrastructure as Code (IaC) for deployment
    ├── buildspec.yml                   # AWS CodeBuild specification
    ├── docker-compose.yml              # Docker Compose for local development and deployment
    └── scripts/                        # Deployment scripts
        └── deploy.sh                   # Script for deploying to EC2
```

## [Application Architecture](./docs/assets/architecture.md)

The application is composed of frontend backend database and infra
- [Frontend README](./frontend/README.md) for details
- [Backend README](./backend/README.md) for details
- [Infra README](./Infra/README.md) for details


## Screenshots

### Home Page
![Home Page](docs/assets/home.png)

### Jobs Board
![Jobs Board](docs/assets/jobsBard.png)

## Getting Started / Local Development With Dockers

To get started with local development, you will need to have Docker and Docker Compose installed, Node 20 or lstest, postgreSQL 16 or latest pdAdmin recomenred but not required, openrouter ali key,and gemeni api key.

1.  **Clone the repository:**

    ```bash
    git clone -b main REPO_URL_HERE
    cd your-repository
    ```

2.  **Run the application using Docker Compose:**

    ```bash
    cd infra
    docker compose up --build
    ```


##  Local Development Without Dockers

1.  **Create a `.env` file in the `backend` directory with the following content:**

    ```
    DATABASE_URL=
    NODE_ENV=development
    OPENROUTER=
    GEMINI_API_KEY=
    ```
2.  **Create a `.env` file in the `frontend` directory with the following content:**

    ```
    REACT_APP_API_URL=
    ```
3.  **Run the application using npm :**
- for backend install packages and run command
    ```bash
    npm i
    npm run dev 
    ```
    - for forntend nstall packages and run command
    ```bash
    npm i
    npm start 
    ```
The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:3001`.

## Deployment / CI/CD

This application is automatically deployed to an AWS EC2 instance when code is pushed to the `main` branch. The deployment process is managed by a GitHub Actions workflow defined in `.github/workflows/deploy-ec2.yml`.

The workflow consists of the following steps:

1.  **Configure AWS Credentials:** Configures the AWS credentials using secrets stored in GitHub.
2.  **Trigger AWS CodeBuild:** Triggers an AWS CodeBuild project to build the Docker images for the frontend and backend and push them to Amazon ECR.
3.  **Deploy to EC2:** SSH into the EC2 instance and runs the `deploy.sh` script located in the `infra/scripts` directory. This script pulls the latest Docker images from ECR and restarts the Docker containers.

### TODO / Imporvements
- TailwindCSS + shadcn/ui component library
- Dark mode & responsive design
- PWA support
- Sentry.io error tracking (frontend + backend)
- BullMQ + Redis (replace pgBoss)
- Visual and intractive job dashboard (/admin/queues)
- Retries, dead letter queues, rate limiting
- S3 + CloudFront for images (vs local disk)
- Sharp.js optimization + multiple sizes
- implement SSL/TLS encryption for secure HTTPS acce
- Local AI - Fine-tuned Model