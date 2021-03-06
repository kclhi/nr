# NR API front-end

An API to enable the storage of non-repudiable data.

## Prerequisites: NR mechanisms

## 1. Fabric

### installation

Install (older version of) Fabric docker images.

```
$ curl -sSL http://bit.ly/2ysbOFE | bash -s -- 1.4.0 1.4.0 0.4.15 -s -b
```

### setup and run chain

From https://medium.com/@kctheservant/an-implementation-example-of-notarization-in-hyperledger-fabric-e66fab155fdb :

Besides Fabric SDK, we also needs handling X509 certificate and cryptography.

#### inside chain/basic-network

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

### setup chain for NR (docker)

Fabric NR setup happens alongside API setup.

### setup chain for NR (non-docker)

#### inside chain/docrec

```
$ npm init -y
$ npm install fabric-ca-client fabric-network crypto-js jsrsasign -S
```

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

We later needs the certificate from alice for signature validation. The certificate can be found inside the wallet. The directory is docrec/wallet/alice/alice.

```
$ cat wallet/alice/alice
```

Use any editor to extract it and keep them into a file: wallet/alicecert.

## 2. Bucket

### inside bucket/certs

#### configuration

Generate certschain/basic-network

```
./gen-ca-cert.sh
./gen-domain-cert.sh
```

### inside bucket

#### run (docker)

```
docker-compose build
docker-compose up -d
```

#### run (non-docker)

Unavailable

## 3. SELinux

Checkout submodule:

```
git submodule init
git submodule update
```

Change into vagrant directory:

```
cd selinux/_vagrant
```

Startup Vagrant machine:

```
vagrant up --no-provision
vagrant provision
```

NB. as of now, openssh-selinux can only be installed into the Vagrant VM with --nocheck.

Enable Selinux enforcement in VM:

```
vagrant ssh
sudo setsebool secure_mode_policyload on
sudo setenforce 1
```

Note IP address of main interface:

```
ifconfig
```

## API

### inside main repo

#### installation (docker)

Add IP address of vagrant machine to `api/routes/selinux.js`.

```
$ docker-compose up -d
```

#### installation (non-docker)

##### inside api

```
$ npm init -y
$ npm install fabric-ca-client fabric-network crypto-js jsrsasign -S
```

Install and bring up API.

```
$ npm install
$ npm start
```

Reference certs for SSL bucket use:

```
export NODE_EXTRA_CA_CERTS=../bucket/certs/nr.crt
```

### usage

[docs](https://big-kcl.github.io/nr/)
