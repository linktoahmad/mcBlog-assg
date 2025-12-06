#!/bin/bash
set -e

ACCOUNT_ID="708895070110"
REGION="ap-southeast-1"
COMPOSE_FILE_PATH="/home/ec2-user/mc-blog/infra/docker-compose.yml"

echo "🚀 Deploying mcblog-fe & mcblog-be to EC2..."

# Login to ECR
echo "🔐 Logging in to ECR..."
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com
echo "✅ ECR login successful!"

# Pull the latest images
echo "🔄 Pulling latest images from ECR..."
docker-compose -f $COMPOSE_FILE_PATH pull
echo "✅ Images pulled successfully!"

# Stop and restart services
echo "🚀 Starting services with docker-compose..."
docker-compose -f $COMPOSE_FILE_PATH up -d --remove-orphans
echo "✅ Deployment complete!"

echo "Cleaning up dangling images..."
docker image prune -f

echo "✅ Deployment successful!"
echo "🌐 Frontend available at http://<your-ec2-instance-public-ip>:3000"
echo "🔧 Backend available at http://<your-ec2-instance-public-ip>:3001"
