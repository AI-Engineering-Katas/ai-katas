FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY app/frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy frontend code
COPY app/frontend/ .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
