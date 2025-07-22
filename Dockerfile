FROM node:24 AS builder

ENV NODE_ENV=build

# Create app directory
WORKDIR /usr/src/app

RUN apt-get update  && \
    apt-get install python3 -y && \
    apt-get install -y build-essential make g++ && \
    apt-get install -y mc

RUN npm install -g pnpm

# Copy package files first to leverage Docker cache
COPY package*.json pnpm-*.yaml ./
COPY apps/fnf/package*.json ./apps/fnf/
COPY apps/fnf/postinstall.js ./apps/fnf/
COPY apps/fnf-api/package*.json ./apps/fnf-api/
COPY libs/fnf-data/package*.json ./libs/fnf-data/

# Install dependencies
RUN pnpm install

# Create necessary directories for the build
#RUN mkdir -p apps/fnf/dist apps/fnf-api/dist apps/fnf-api-test/dist libs/fnf-data/dist

# Bundle app source (excluding node_modules and dist directories as specified in .dockerignore)
COPY . .

# Build the application
RUN pnpm build:all

# Prune dev dependencies after build
RUN pnpm prune --prod

# ---

FROM node:24-slim AS production

LABEL "nick"="fnf"

ENV NODE_ENV=production

WORKDIR /usr/src/app

RUN apt-get update && \
    apt-get install rsync -y && \
    apt-get install -y libc6-dev python3 build-essential make g++ && \
    npm install -g pnpm node-gyp


# Copy package files needed for rebuild
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Copy root node_modules
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Rebuild native modules for the production environment
RUN cd node_modules/.pnpm/node-pty@1.0.0/node_modules/node-pty && node-gyp rebuild

# Copy your full app (built dist + sources if needed)
COPY --from=builder /usr/src/app/apps/fnf-api/dist ./apps/fnf-api
COPY --from=builder /usr/src/app/apps/fnf-api/node_modules ./apps/fnf-api/node_modules
COPY --from=builder /usr/src/app/libs/fnf-data ./libs/fnf-data

COPY --from=builder /usr/src/app/apps/fnf/dist/fnf ./apps/fnf-api/fnf


# friends don’t let friends run containers as root!
# USER node
USER root

EXPOSE 3333 3334

CMD ["node", "apps/fnf-api/main.js"]
