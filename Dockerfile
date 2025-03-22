# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port that your application runs on
EXPOSE 8080

# Command to start the application
CMD ["npm", "run", "start"]

env:
    NEXT_PUBLIC_ADMIN_USERNAME: ${{ secrets.NEXT_PUBLIC_ADMIN_USERNAME }}
    NEXT_PUBLIC_ADMIN_PASSWORD: ${{ secrets.NEXT_PUBLIC_ADMIN_PASSWORD }}
    AZURE_STORAGE_CONNECTION_STRING: ${{ secrets.AZURE_STORAGE_CONNECTION_STRING }}
    AZURE_STORAGE_CONTAINER_NAME: f${{ secrets.AZURE_STORAGE_CONTAINER_NAME }}
    DB_USERNAME: ${{ secrets.DB_USERNAME }}
    DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
    AZURE_STORAGE_ACCOUNT_NAME: ${{ secrets.AZURE_STORAGE_ACCOUNT_NAME }}
    AZURE_STORAGE_ACCOUNT_KEY: ${{ secrets.AZURE_STORAGE_ACCOUNT_KEY }}