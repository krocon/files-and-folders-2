FROM node:24 as builder

ENV NODE_ENV build

# Create app directory
WORKDIR /usr/src/app

RUN apt-get update  && \
    apt-get install python3 -y && \
    apt-get install -y mc

RUN npm install -g pnpm

# Copy package files first to leverage Docker cache
COPY package*.json pnpm-*.yaml ./
COPY apps/fnf/package*.json ./apps/fnf/
COPY apps/fnf-api/package*.json ./apps/fnf-api/
COPY apps/fnf-api-test/package*.json ./apps/fnf-api-test/
COPY libs/fnf-data/package*.json ./libs/fnf-data/

# Install dependencies
RUN pnpm install

# Create necessary directories for the build
#RUN mkdir -p apps/fnf/dist apps/fnf-api/dist apps/fnf-api-test/dist libs/fnf-data/dist

# Bundle app source (excluding node_modules and dist directories as specified in .dockerignore)
COPY . .

# Build the application
RUN pnpm build:all && pnpm prune --prod

# ---

FROM node:24-slim as production

LABEL "nick"="fnf"

ENV NODE_ENV production

WORKDIR /usr/src/app

RUN apt-get update && apt-get install rsync -y && npm install -g pnpm


# Copy root node_modules
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./pnpm-workspace.yaml

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
