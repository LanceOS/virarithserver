# Use a Node.js base image
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml (or package-lock.json/yarn.lock)
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm (or npm/yarn)
RUN corepack enable && pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the SvelteKit application for production
RUN pnpm build

# --- Production Stage ---
FROM node:20-alpine

WORKDIR /app

# Copy only necessary files from the builder stage
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build

# Expose the port SvelteKit will run on
EXPOSE 3000

# Command to run the SvelteKit application
CMD ["node", "build"]