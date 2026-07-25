FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy prisma schema
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Copy rest of the app
COPY . .

# Expose port
EXPOSE 5000

# Start the app
CMD ["sh", "-c", "npx prisma db push --skip-generate && node src/index.js"]
