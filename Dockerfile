# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
RUN npm install -g pm2

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .
USER node
RUN chown -R node:node /usr/src/app


# Creates a "dist" folder with the production build
RUN npm run build
EXPOSE 3000

# Start the server using the production build

CMD [ "yarn", "start" ]