FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev for prisma)
RUN npm install

# Copy prisma schema and migrations
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Copy rest of the app
COPY . .

# Expose port
EXPOSE 5000

# Run migrations and start the app
CMD ["sh", "-c", "npx prisma migrate deploy && node src/index.js"]
