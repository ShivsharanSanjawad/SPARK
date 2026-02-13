FROM node:18.20.2-alpine

# Set the working directory inside the container
WORKDIR /app

# Ensure locally installed node modules are found
ENV PATH="/app/node_modules/.bin:${PATH}"

# Configure the dev server to listen on all interfaces inside Docker
ENV HOST=0.0.0.0
ENV PORT=3000

# Improve file watching behavior inside Docker (especially on Windows/macOS)
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true

# Install dependencies first (leverages Docker layer caching)
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the application source
COPY . .

# Expose the development server port
EXPOSE 3000

# Start the React development server
CMD ["npm", "start"]


