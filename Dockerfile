FROM node:24 as builder

ENV NODE_ENV build

# Create app directory
WORKDIR /usr/src/app

RUN apt-get update

RUN npm install -g pnpm

RUN apt-get install python3 -y

# Bundle app source
COPY . .

RUN pnpm install --frozen-lockfile \
    && npm build:all \
    && npm prune --production

# ---

FROM node:24-slim as production

LABEL "nick"="fnf"

ENV NODE_ENV production

WORKDIR /usr/src/app

RUN apt-get update

RUN npm install -g pnpm

RUN apt-get install rsync -y

COPY package*.json ./

RUN pnpm install --frozen-lockfile

COPY --chown=node:node . .

COPY --chown=node:node --from=builder /usr/src/app/dist ./dist

# friends don’t let friends run containers as root!
USER node

EXPOSE 3333 3334

CMD ["node", "apps/fnf-api/dist/main.js"]
