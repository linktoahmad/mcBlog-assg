#!/bin/bash

# ==============================
# mcblog Deployment Script
# ==============================

ACCOUNT_ID="708895070110"
REGION="ap-southeast-1"
EC2_HOST="13.60.183.195"

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
  -e POSTGRES_DB=blogAppDb \
  -e POSTGRES_USER=blogAppUser \
  -e POSTGRES_PASSWORD=blogPass321 \
  -p 5432:5432 \
  --mount source=postgres_data,target=/var/lib/postgresql/data \
  postgres:16-alpine

# Wait for Postgres to be ready
echo "Waiting for Postgres..."
until docker exec postgres pg_isready -U blogAppUser -d blogAppDb; do
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
  -e DATABASE_URL="postgres://blogAppUser:blogPass321@$EC2_HOST:5432/blogAppDb" \
  -e NODE_ENV=production \
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