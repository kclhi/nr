FROM node:11

# Copy Fabric NR dependency
WORKDIR /usr/src/basic-network
COPY basic-network .

# Create app directory
WORKDIR /usr/src/docrec

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY docrec/package*.json ./

RUN npm install

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY docrec .

EXPOSE 3000
CMD [ "npm", "start" ]
