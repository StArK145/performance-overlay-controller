# Use an official Node.js image
FROM node:22.12

# Install xvfb and xauth
RUN apt-get update && apt-get install -y xvfb xauth

# Set the working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Start the app using xvfb-run to enable Electron in a headless environment
CMD ["xvfb-run", "npm", "run", "app"]
