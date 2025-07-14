FROM node:24 as builder

ENV NODE_ENV build

# Create app directory
WORKDIR /usr/src/app

RUN apt-get update && apt-get install python3 -y

RUN npm install -g pnpm

# Copy package files first to leverage Docker cache
COPY package*.json pnpm-*.yaml ./
COPY apps/fnf/package*.json ./apps/fnf/
COPY apps/fnf-api/package*.json ./apps/fnf-api/
COPY apps/fnf-api-test/package*.json ./apps/fnf-api-test/
COPY libs/fnf-data/package*.json ./libs/fnf-data/

# Install dependencies
RUN pnpm install

# Bundle app source
COPY . .

# Build the application
RUN pnpm build:all && pnpm prune --prod

# ---

FROM node:24-slim as production

LABEL "nick"="fnf"

ENV NODE_ENV production

WORKDIR /usr/src/app

RUN apt-get update && apt-get install rsync -y && npm install -g pnpm

# Copy package files and install production dependencies
COPY package*.json pnpm-*.yaml ./
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Copy built application from builder stage
COPY --from=builder /usr/src/app/dist ./dist

# friends don’t let friends run containers as root!
USER node

EXPOSE 3333 3334

CMD ["node", "apps/fnf-api/dist/main.js"]
