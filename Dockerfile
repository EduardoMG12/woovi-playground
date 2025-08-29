
FROM node:23.8.0-alpine

WORKDIR /app

RUN corepack enable

COPY .npmrc .
COPY pnpm-lock.yaml .
COPY package.json .
COPY pnpm-workspace.yaml .

RUN pnpm install --frozen-lockfile

COPY . .

ENV PORT=4000
EXPOSE 4000

WORKDIR /app/apps/server
CMD ["pnpm", "dev"]