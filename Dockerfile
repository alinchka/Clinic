FROM docker:20.10

# Install docker-compose
RUN apk add --no-cache docker-compose

# Copy docker-compose file
COPY docker-compose.production.yml .

# Set working directory
WORKDIR /app

# Copy the rest of the application
COPY . .

# Default command
CMD ["docker-compose", "-f", "docker-compose.production.yml", "up"] 