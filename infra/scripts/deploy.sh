#!/bin/bash
ACCOUNT_ID="524863153585"
REGION="us-east-1"

echo "🚀 Deploying mcblog-fe & mcblog-be to EC2..."
# Login to ECR
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

# Stop existing containers
docker stop mcblog-frontend mcblog-backend postgres || true
docker rm mcblog-frontend mcblog-backend postgres || true

# Start Postgres
docker run -d --name postgres \
  -e POSTGRES_DB=blogAppDb \
  -e POSTGRES_USER=blogAppUser \
  -e POSTGRES_PASSWORD=blogPass321 \
  -v postgres_data:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres:16-alpine

echo "⏳ Waiting for Postgres (20s)..."
sleep 20

# Start Backend from ECR
docker run -d --name mcblog-backend \
  -e DATABASE_URL="postgres://blogAppUser:blogPass321@host.docker.internal:5432/blogAppDb" \
  -e NODE_ENV=production \
  -p 3001:3001 \
  $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/mcblog-be:latest

# Start Frontend from ECR
docker run -d --name mcblog-frontend \
  -e REACT_APP_API_URL="http://host.docker.internal:3001" \
  -p 3000:3000 \
  $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/mcblog-fe:latest

echo "✅ Deployment complete!"
echo "🌐 Frontend: http://$(curl -s ifconfig.me):3000"
echo "🔧 Backend: http://$(curl -s ifconfig.me):3001"
echo "📊 Postgres: localhost:5432"
