FROM node:11

# Copy Fabric network dependency
COPY chain/basic-network /usr/src/chain/basic-network

# Install Fabric NR dependency
COPY chain/docrec /usr/src/chain/docrec

# Create app directory
WORKDIR /usr/src/api

# Copy cert for accessing bucket. To be refed in compose.
COPY ./bucket/certs/nr.crt nr.crt

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY api/package*.json ./

RUN npm install

# If you are building your code for production
# RUN npm ci --only=production

COPY api .

CMD [ "node", "../chain/docrec/enrollAdmin.js" ]
CMD [ "node", "../chain/docrec/registerUser.js alice" ]

EXPOSE 3000
CMD [ "npm", "start" ]
