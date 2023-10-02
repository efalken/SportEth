FROM node:18-alpine as FRONTEND_BUILD_IMAGE

WORKDIR /app

COPY frontend/package.json .
COPY frontend/package-lock.json .

RUN npm install

COPY frontend/index.html .
COPY frontend/*.config.js .
COPY frontend/tsconfig.json .
COPY frontend/tsconfig.node.json .
COPY frontend/vite.config.ts .
COPY frontend/public public
COPY frontend/src src
# COPY frontend/.env.staging .env

RUN yarn build

FROM nginx

LABEL name="sporteth_nginx"

COPY --from=FRONTEND_BUILD_IMAGE /app/dist /frontend
COPY nginx/default.conf /etc/nginx/conf.d/default.conf