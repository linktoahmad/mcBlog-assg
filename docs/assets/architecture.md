# Application Architecture

This document provides a detailed overview of the application's architecture, from the CI/CD pipeline to the runtime components and their interactions.

## High-Level Overview

The application is a full-stack blog platform composed of a React frontend and a Node.js backend. Both are containerized with Docker and deployed to an AWS EC2 instance. It features a PostgreSQL database for data storage and a background job processing system for handling long-running tasks like AI-powered article generation.

# Application Architecture

This document provides a detailed overview of the application's architecture, from the CI/CD pipeline to the runtime components and their interactions.

## High-Level Overview

The application is a full-stack blog platform composed of a React frontend and a Node.js backend. Both are containerized with Docker and deployed to an AWS EC2 instance. It features a PostgreSQL database for data storage and a background job processing system for handling long-running tasks like AI-powered article generation.



## Architecture Diagram Overview

```ascii

┌────────────────────────────────────────────────────────────┐
│                        AWS EC2 (t2.micro)                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Frontend   │    │   Backend    │    │  PostgreSQL  │  │
│  │  React App   │◄──►│  Node.js API │◄──►│   blogdb     │  │
│  │   :3000      │    │ + node-cron  │    │  articles    │  │
│  │              │    │   :3001      │    │              │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│           ▲                               ▲                │
│           │                               │                │
│  ┌────────┼────────┐              ┌───────┼──────────────┤ │
│  │ docker │ docker │              │ docker│ docker volume│ │
│  │ run    │ run    │              │ run   │ postgres_data│ │
│  └────────┼────────┘              └───────┼──────────────┘ │
│          │                                │                │
└──────────┼─────────────────────-──────────┼────────────────┘
           │                                │
    ┌────-─▼───────┐              ┌────--───▼──────┐
    │   deploy.sh  │              │     ECR        │
    │  Script      │◄────────────▶│   Repositories │
    │              │              │  mcblog-fe/be  │
    └──────────────┘              └───────┬────────┘
                                          │
                                 ┌────────▼────────┐
                                 │   CodeBuild     │
                                 │   Pipeline      │
                                 │  buildspec.yml  │
                                 └────────┬────────┘
                                          │
                                 ┌────────▼────────┐
                                 │   GitHub Repo   │
                                 │ yourusername/   │
                                 │   auto-blog     │
                                 └──────────────-──┘
``` 

## Architecture Diagram 

```ascii

+------------------------------+       +----------------------------------------------------------------------+
|   Frontend Container (Nginx) |       |                          Backend Container (Node.js)                 |
|------------------------------|       |----------------------------------------------------------------------|
|                              |       |                                                                      |
|    [Serves React App]        |<------| User Request    +-----------------+      +-----------------------+   |
|            ^                 |       |                 | Express Server  |----->|    Service Layer      |   |
|            |                 |       |                 +-----------------+      +----------+------------+   |
+------------|-----------------+       |                              |                       |               |
             |                         |         API Request (/api)   |                       | DB Calls      |
             | Initial Load            |                              |                       v               |
             v                         |                              v             +---------------------+   |
+------------------------------+       |    [Browser]------>[Nginx]------>[Backend] |    Sequelize ORM    |   |
|       User's Browser         |       |                                            +---------------------+   |
|      (React Client)          |------>|                                                            |         |
|                              | /api  |                                                            |         |
+------------------------------+       +------------------------------------------------------------|---------+
                                                                                                    | DB Connection
                                                                                                    v
                                                                                     +------------------------------+
                                                                                     |  PostgreSQL DB (Container)   |
                                                                                     |------------------------------|
                                                                                     |                              |
                                                                                     |      [pg-boss job table]     |
                                                                                     |                              |
                                                                                     +--------------+---------------+
                                                                                            ^                |
                                                                                            | Schedules Job  | Processes Job
                                                                                            |                v
                                                              +-------------------------------------------------------+
                                                              |             Backend Internal Processes                |
                                                              |-------------------------------------------------------|
                                                              | +-----------------+      +--------------------------+ |
                                                              | | Service Layer   |----->|   pg-boss Client         | |
                                                              | +-----------------+      +--------------------------+ |
                                                              |                                                       |
                                                              | +-----------------+      +--------------------------+ |
                                                              | | Article Worker  |<-----|   pg-boss Client         | |
                                                              | +-------+---------+      +--------------------------+ |
                                                              |         |                                             |
                                                              |         | Calls External AI APIs                      |
                                                              |         v                                             |
                                                              | +------------------+                                  |
                                                              | | External Services|                                  |
                                                              | +------------------+                                  |
                                                              +-------------------------------------------------------+

```

## Component Descriptions

### CI/CD Pipeline (GitHub Actions)
-   **Trigger**: The pipeline is automatically triggered on every push to the `main` branch.
-   **Build**: It builds the Docker images for both the frontend and backend services based on their respective `Dockerfiles`.
-   **Push**: The newly built images are tagged and pushed to a Docker registry (e.g., Amazon ECR or Docker Hub).
-   **Deploy**: The pipeline then connects to the AWS EC2 instance and runs a deployment script (`infra/scripts/deploy.sh`). This script pulls the latest Docker images and restarts the services using Docker Compose.

### Frontend Container (Nginx)
-   **Environment**: A Docker container running on the AWS EC2 instance.
-   **Nginx**: A lightweight web server that has two primary roles:
    1.  **Serves Static Content**: It serves the compiled, production-ready React application (HTML, CSS, JS) to the user's browser on the initial load.
    2.  **Acts as a Reverse Proxy**: It forwards any requests with a path starting with `/api/` to the Backend Container. This avoids CORS issues and simplifies frontend configuration.

### User's Browser
-   This is the client-side environment where the user interacts with the application.
-   It downloads and runs the React application from the Frontend Container.
-   User interactions (like clicking a button) trigger API requests from the browser to the backend. These requests are transparently routed through the Nginx proxy.

### Backend Container (Node.js)
-   **Environment**: A Docker container running on the AWS EC2 instance.
-   **Express Server**: The entry point for all API requests proxied from Nginx. It directs requests to the appropriate services.
-   **Service Layer**: Contains the core business logic. It handles data validation, orchestrates operations (like creating a job or fetching data), and uses Sequelize to interact with the database.
-   **Sequelize ORM**: The Object-Relational Mapper that translates between JavaScript objects and the PostgreSQL database schema.
-   **pg-boss Client & Article Worker**: These components manage background jobs. The `pg-boss` client, running within the Node.js application, schedules jobs by inserting them into a table in the PostgreSQL database. The `Article Worker` is a separate process within the same container that polls the database for new jobs to execute.

### PostgreSQL Database Container
-   **Environment**: A dedicated Docker container running on the AWS EC2 instance, managed by Docker Compose.
-   **PostgreSQL**: A relational database that stores all application data, including the `articles` table.
-   **pg-boss job table**: A specific table within the database that `pg-boss` uses to manage the state of all jobs (pending, active, completed, failed).

### External AI Services
-   **OpenRouter & Google GenAI**: Third-party APIs used for content and image generation. These are called exclusively by the `Article Worker` in the backend.

## Detailed Interaction Flows

### 1. User Viewing Articles
1.  The user's browser makes a request to the application's URL.
2.  Nginx in the Frontend Container serves the static React application files.
3.  The React app loads in the browser. The `Home` page component triggers an API call to `GET /api/articles`.
4.  The browser sends this request back to Nginx, which proxies it to the Express server in the Backend Container.
5.  The `articleService` uses Sequelize to fetch all articles from the PostgreSQL database.
6.  The backend responds with a JSON array of articles, which is sent back through Nginx to the browser.
7.  The React app renders the list of articles.

### 2. User Generating a New Article
1.  An event (e.g., a button click or an automated schedule) triggers an API call to `POST /api/articles/generate`.
2.  The request is proxied through Nginx to the Backend Container.
3.  The `articleService` uses the `pg-boss` client to insert a new job into the job table in PostgreSQL.
4.  The backend immediately returns a `202 Accepted` response to the browser.
5.  The `Article Worker` process, which is polling the job table, discovers the new job.
6.  The worker executes the job, making API calls to the external AI services.
7.  Once the AI-generated content is retrieved, the worker uses Sequelize to save the new article to the database.
8.  The job is marked as complete in the `pg-boss` table. The new article will now be visible on subsequent requests to `GET /api/articles`.