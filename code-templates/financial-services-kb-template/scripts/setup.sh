#!/bin/bash
# Setup script for Financial Services Knowledge Base

# Make script exit on first error
set -e

# Print commands before executing
set -x

# Define colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Setting up Financial Services Knowledge Base development environment...${NC}"

# Check if podman is installed
if ! command -v podman &> /dev/null; then
    echo -e "${YELLOW}Podman is not installed. Please install podman before continuing.${NC}"
    echo "Installation instructions: https://podman.io/getting-started/installation"
    exit 1
fi

# Check if podman-compose is installed
if ! command -v podman-compose &> /dev/null; then
    echo -e "${YELLOW}Podman-compose is not installed. Please install podman-compose before continuing.${NC}"
    echo "Installation instructions: https://github.com/containers/podman-compose"
    exit 1
fi

# Create necessary directories
echo -e "${GREEN}Creating directories...${NC}"
mkdir -p data/raw data/processed data/embeddings

# Build and start containers
echo -e "${GREEN}Building and starting containers...${NC}"
cd podman
podman-compose build
podman-compose up -d

echo -e "${GREEN}Setup complete!${NC}"
echo -e "API is running at: ${YELLOW}http://localhost:8000${NC}"
echo -e "Frontend is running at: ${YELLOW}http://localhost:3000${NC}"
echo -e "Vector database UI is running at: ${YELLOW}http://localhost:6333/dashboard${NC}"

echo -e "\n${GREEN}Next steps:${NC}"
echo "1. Open the frontend in your browser: http://localhost:3000"
echo "2. Try asking a question to test the system"
echo "3. Start implementing Milestone 2: Document Processing Pipeline"
