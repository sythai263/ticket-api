FROM node:gallium AS dist
COPY package.json yarn.lock ./

RUN yarn install

COPY . ./

RUN yarn build

FROM node:gallium AS node_modules
COPY package.json yarn.lock ./

RUN yarn install --prod

FROM node:gallium

ARG PORT=3000

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY --from=dist dist /usr/src/app/build
COPY --from=node_modules node_modules /usr/src/app/node_modules

COPY . /usr/src/app

EXPOSE $PORT

CMD [ "yarn", "start:prod" ]