FROM node:18.20.2-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --prefer-offline --no-audit

# Copy application source
COPY . .

# Build the application
RUN npm run build


# Production stage
FROM node:18.20.2-alpine

WORKDIR /app

# Install serve to run the production build
RUN npm install -g serve

# Copy build output from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./

# Expose production port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start the production server
CMD ["serve", "-s", "build", "-l", "3000"]



