FROM node:18-alpine as BUILD_IMAGE

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY src ./src
COPY prisma ./prisma

RUN npm run generate

FROM node:18-alpine

EXPOSE 8000
CMD [ "npm", "run", "start" ]

WORKDIR /app

# copy from build image
COPY --from=BUILD_IMAGE /app/prisma ./prisma
COPY --from=BUILD_IMAGE /app/src ./src
COPY --from=BUILD_IMAGE /app/node_modules ./node_modules
COPY --from=BUILD_IMAGE /app/package.json .
COPY --from=BUILD_IMAGE /app/package-lock.json .