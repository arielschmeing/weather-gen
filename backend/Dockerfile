FROM node:20 AS builder

WORKDIR /usr/src/api

RUN npm install -g pnpm

COPY . .

RUN pnpm install

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "run", "start:prod"]