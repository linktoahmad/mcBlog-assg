# Infrastructure

This folder contains the infrastructure configuration for the mcblog application.

## Local Development

For local development, we use `docker-compose` to spin up the required services.

### Services

- `postgres`: The PostgreSQL database.
- `backend`: The Node.js backend application.
- `frontend`: The React frontend application.

### Usage

To start the services for local development, run the following command from the `infra` directory:

```bash
docker-compose up
```

This will start the services in the foreground. To run them in the background, use the `-d` flag:

```bash
docker-compose up -d
```

### ASCII Diagram (Local)

```
+-----------------------------------+
|        Developer's Machine        |
|                                   |
|  +-----------------------------+  |
|  |      Docker Environment     |  |
|  |                             |  |
|  |  +-----------------------+  |  |
|  |  |      Frontend         |  |  |
|  |  | (React) - Port 3000   |  |  |
|  |  +-----------+-----------+  |  |
|  |              |              |  |
|  |  +-----------+-----------+  |  |
|  |  |      Backend          |  |  |
|  |  | (Node.js) - Port 3001 |  |  |
|  |  +-----------+-----------+  |  |
|  |              |              |  |
|  |  +-----------+-----------+  |  |
|  |  |      PostgreSQL       |  |  |
|  |  | (Postgres) - Port 5432|  |  |
|  |  +-----------------------+  |  |
|  |                             |  |
|  +-----------------------------+  |
|                                   |
+-----------------------------------+
```

## Deployment

Deployment to the EC2 instance is handled by AWS CodeBuild and a deployment script.

### AWS CodeBuild

The `buildspec.yml` file defines the build process for the application. It does the following:

1. Logs in to Amazon ECR.
2. Builds the Docker images for the frontend and backend.
3. Tags the images with the latest tag.
4. Pushes the images to Amazon ECR.

### Deployment Script

The `scripts/deploy.sh` script is run on the EC2 instance to deploy the application. It does the following:

1. Logs in to Amazon ECR.
2. Stops and removes any old running containers.
3. Creates a Docker volume for the PostgreSQL data.
4. Starts the PostgreSQL container.
5. Waits for PostgreSQL to be ready.
6. Pulls the latest images from Amazon ECR.
7. Starts the backend container.
8. Starts the frontend container.

### ASCII Diagram (Deployment)

```
+--------------------------------------------------------------------------------------+
|                                     AWS Cloud                                      |
|                                                                                      |
|  +-----------------+      +----------------------+      +-------------------------+  |
|  |                 |      |                      |      |                         |  |
|  |   AWS CodeBuild |----->|  Amazon ECR          |----->|   EC2 Instance          |  |
|  |                 |      | (Docker Registry)    |      |                         |  |
|  |  - Builds Docker|      |                      |      |  +-------------------+  |  |
|  |    images       |      |  - Stores Docker     |      |  |  Docker           |  |  |
|  |  - Pushes to ECR|      |    images            |      |  |                   |  |  |
|  |                 |      |                      |      |  | +---------------+ |  |  |
|  +-----------------+      +----------------------+      |  | | Frontend      | |  |  |
|                                                         |  | +---------------+ |  |  |
|                                                         |  | | Backend       | |  |  |
|                                                         |  | +---------------+ |  |  |
|                                                         |  | | PostgreSQL    | |  |  |
|                                                         |  | +---------------+ |  |  |
|                                                         |  |                   |  |  |
|                                                         |  +-------------------+  |  |
|                                                         |                         |  |
|                                                         +-------------------------+  |
|                                                                                      |
+--------------------------------------------------------------------------------------+
```
