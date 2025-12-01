FROM node:20.19-slim AS build

RUN npm install -g pnpm

WORKDIR /app

ENV CI=true

COPY . .

RUN pnpm install --prod=false --shamefully-hoist

RUN pnpm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]