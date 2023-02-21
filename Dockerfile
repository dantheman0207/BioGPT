# use node v18 base image
FROM node:18

# set working directory
WORKDIR /usr/src/app

# copy package.json and package-lock.json
COPY package*.json ./

# install dependencies
RUN npm install

# copy source code
COPY . .

# set an entrypoint
ENTRYPOINT [ "npm", "start" ]
