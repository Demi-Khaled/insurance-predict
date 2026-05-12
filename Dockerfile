FROM node:20-bookworm-slim

# Install system dependencies for Prisma (Bookworm has OpenSSL 3.0.x)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    openssl \
    libssl3 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy Prisma files and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Expose the application port
EXPOSE 3000

# Run migrations and start the application
# We use --accept-data-loss for development ease on RDS
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && npm start"]
