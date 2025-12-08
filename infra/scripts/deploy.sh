#!/bin/bash

# ==============================
# mcblog Deployment Script
# ==============================

ACCOUNT_ID="accoundt_id_here"
REGION="ap-southeast-1"
EC2_HOST="url_or_ip_here"

echo "🚀 Deploying mcblog-fe & mcblog-be to EC2..."

# Login to ECR
aws ecr get-login-password --region $REGION \
  | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

# Stop old containers
echo "Stopping old containers..."
docker stop mcblog-frontend mcblog-backend postgres || true
docker rm mcblog-frontend mcblog-backend postgres || true

# Ensure persistent volume
echo "Ensuring persistent volume..."
docker volume create postgres_data || true

# Start Postgres
echo "Starting Postgres..."
docker run -d --name postgres \
  -e POSTGRES_DB=database_name \
  -e POSTGRES_USER=database_user \
  -e POSTGRES_PASSWORD=database_password \
  -p 5432:5432 \
  --mount source=postgres_data,target=/var/lib/postgresql/data \
  postgres:16-alpine

# Wait for Postgres to be ready
echo "Waiting for Postgres..."
until docker exec postgres pg_isready -U database_user -d database_name; do
  echo "Postgres not ready yet..."
  sleep 2
done
echo "✅ Postgres ready!"

# Pull latest images from ECR
echo "Pulling latest images from ECR..."
docker pull $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/mcblog-be:latest
docker pull $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/mcblog-fe:latest

# Start Backend
echo "Starting Backend..."
docker run -d --name mcblog-backend \
  -e DATABASE_URL="postgres://database_user:database_password@$EC2_HOST:5432/database_name" \
  -e NODE_ENV=production \
  -e OPENROUTER=key_will_go_here \
  -e GEMINI_API_KEY=key_will_go_here \
  -p 3001:3001 \
  $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/mcblog-be:latest

# Start Frontend
echo "Starting Frontend..."
docker run -d --name mcblog-frontend \
  -e REACT_APP_API_URL="http://$EC2_HOST:3001" \
  -p 3000:3000 \
  $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/mcblog-fe:latest

# Done
echo "✅ Deployment Completed Successfully!"
echo "Frontend: http://$EC2_HOST:3000"
echo "Backend: http://$EC2_HOST:3001"
echo "Postgres: localhost:5432"

# List running containers
echo "Checking running containers..."
docker ps