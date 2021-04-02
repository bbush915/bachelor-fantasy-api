FROM node:12-alpine as base

RUN mkdir -p /app
WORKDIR /app
ADD . /app

RUN yarn install

FROM base as build
RUN yarn build

FROM build as release
CMD ["yarn", "start"]
