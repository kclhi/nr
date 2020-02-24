FROM node:11

# Copy Fabric network dependency
COPY chain/basic-network /usr/src/chain/basic-network

# Install Fabric NR dependency
COPY chain/docrec /usr/src/chain/docrec

WORKDIR /usr/src/chain/docrec

# Install dependencies in docrec folder
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY api/package*.json ./

RUN npm install

RUN node enrollAdmin.js
RUN node registerUser.js alice
# Extract alice cert for validation
RUN cat ./wallet/alice/alice | grep -Po '\-.*\-' | awk '{gsub(/\\n/,"\n")}1' >> ./wallet/alicecert

VOLUME /usr/src/chain

# Create app directory
WORKDIR /usr/src/api

# Copy cert for accessing bucket. To be refed in compose.
COPY ./bucket/certs/nr.crt nr.crt

# Copy keys for ssh access to selinux machine.
COPY ./selinux/_vagrant/keys ../selinux/_vagrant/keys
RUN chmod -R og-rwx ../selinux/_vagrant/keys

# Install app dependencies
COPY api/package*.json ./

RUN npm install

# If you are building your code for production
# RUN npm ci --only=production

COPY api .

EXPOSE 3010
CMD [ "npm", "start" ]
