# Use official Node.js Alpine LTS image for lean container footprint
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy dependency specifications
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy web application assets and logic
COPY index.html script.js ./

# Expose web server application port
EXPOSE 8080

# Container healthcheck instruction
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

# Launch application server
CMD ["npx", "http-server", "-p", "8080", "-a", "0.0.0.0"]
