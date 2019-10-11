Besides Fabric SDK, we also needs handling X509 certificate and cryptography.

#### inside docrec

```
$ npm init -y
$ npm install fabric-ca-client fabric-network crypto-js jsrsasign -S
```

Bring up Basic Network and check if all five containers are up and running. After that the Basic Network is up and running with a channel mychannel is created and the peer node joins the channel.

#### inside basic-network
```
$ ./start.sh && docker-compose -f docker-compose.yml up -d cli
$ docker ps
```
Check all five containers are up and running.

After Basic Network is up and running, we can work on the chaincode installation and instantiation.

#### any directory
```
$ docker exec cli peer chaincode install -n docrec -v 1.0 -p "github.com/docrec"
$ docker exec cli peer chaincode instantiate -o orderer.example.com:7050 -C mychannel -n docrec -v 1.0 -c '{"Args":[]}' -P "OR ('Org1MSP.member')"
```

Use enrollAdmin.js to enrol an admin. If admin is in docrec/wallet, it is already enrolled and it will be used later.

#### inside docrec
```
$ node enrollAdmin.js
$ ls wallet
```

Use registerUser.js to enrol users alice and bob. If they are already in the docrec/wallet, they are already enrolled and can be used later.

```
$ node registerUser.js alice
$ node registerUser.js bob
$ ls wallet
```
