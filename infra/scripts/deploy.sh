#!/bin/bash
ACCOUNT_ID="708895070110"
REGION="ap-southeast-1"

echo "🚀 Auto-deploying NEW images..."

# FORCE re-login
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

# STOP + REMOVE containers + IMAGES (forces NEW pull)
docker stop mcblog-frontend mcblog-backend postgres || true
docker rm mcblog-frontend mcblog-backend postgres || true
docker rmi $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/mcblog-fe:latest || true
docker rmi $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/mcblog-be:latest || true

# Postgres
docker volume create postgres_data || true
docker run -d --name postgres -e POSTGRES_DB=blogAppDb -e POSTGRES_USER=blogAppUser -e POSTGRES_PASSWORD=blogPass321 -p 5432:5432 --mount source=postgres_data,target=/var/lib/postgresql/data postgres:16-alpine

until docker exec postgres pg_isready -U blogAppUser -d blogAppDb; do echo "Waiting Postgres..."; sleep 2; done

# FORCE PULL + RUN NEW images
docker pull $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/mcblog-be:latest
docker run -d --name mcblog-backend -e DATABASE_URL="postgres://blogAppUser:blogPass321@localhost:5432/blogAppDb" -e NODE_ENV=production -p 3001:3001 $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/mcblog-be:latest

sleep 5
docker pull $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/mcblog-fe:latest
docker run -d --name mcblog-frontend -e REACT_APP_API_URL="http://localhost:3001" -p 3000:3000 $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/mcblog-fe:latest

echo "✅ Deployment complete!"
echo "🌐 Frontend: http://$(curl -s ifconfig.me):3000"
echo "🔧 Backend: http://$(curl -s ifconfig.me):3001"
echo "📊 Postgres: localhost:5432"