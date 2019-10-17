# Fabric NR API front-end

## Fabric

### Installation

Install (older version of) Fabric docker images.

```
curl -sSL http://bit.ly/2ysbOFE | bash -s -- 1.4.0 1.4.0 0.4.15 -s -b
```

### Configuration

From https://medium.com/@kctheservant/an-implementation-example-of-notarization-in-hyperledger-fabric-e66fab155fdb :

Besides Fabric SDK, we also needs handling X509 certificate and cryptography.

#### inside docrec

```
$ npm init -y
$ npm install fabric-ca-client fabric-network crypto-js jsrsasign -S
```

#### inside basic-network

Bring up Basic Network and check if all five containers are up and running. After that the Basic Network is up and running with a channel mychannel is created and the peer node joins the channel.

```
$ ./start.sh && docker-compose -f docker-compose.yml up -d cli
$ docker ps
```
Check all five containers are up and running.

#### any directory

After Basic Network is up and running, we can work on the chaincode installation and instantiation.

```
$ docker exec cli peer chaincode install -n docrec -v 1.0 -p "github.com/docrec"
$ docker exec cli peer chaincode instantiate -o orderer.example.com:7050 -C mychannel -n docrec -v 1.0 -c '{"Args":[]}' -P "OR ('Org1MSP.member')"
```

#### inside docrec

Use enrollAdmin.js to enrol an admin. If admin is in docrec/wallet, it is already enrolled and it will be used later.

```
$ node enrollAdmin.js
$ ls wallet
```

Use registerUser.js to enrol users alice and bob. If they are already in the docrec/wallet, they are already enrolled and can be used later.

```
$ node registerUser.js alice
$ ls wallet
```

## API

### Node

#### inside docrec

```
npm install
```

```
npm start
```

### docker

#### inside fabric

```
docker build -t fabric-nr .
```

```
docker run --network host fabric-nr
```
