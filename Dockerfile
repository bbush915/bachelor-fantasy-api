FROM node:12-alpine as BASE

RUN mkdir -p /app
WORKDIR /app
ADD . /app

RUN yarn install

FROM BASE as BUILD
RUN yarn build

FROM BUILD as RELEASE
CMD ["yarn", "start"]
