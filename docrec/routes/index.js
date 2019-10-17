var express = require('express');
var router = express.Router();

const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const { KJUR, KEYUTIL, X509 } = require('jsrsasign');
const CryptoJS = require('crypto-js');

const ccpPath = path.resolve(__dirname, '../../', 'basic-network', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

const caCertPath = path.resolve(__dirname, '../../', 'basic-network', 'crypto-config', 'peerOrganizations', 'org1.example.com', 'ca', 'ca.org1.example.com-cert.pem');
const caCert = fs.readFileSync(caCertPath, 'utf8');

async function add(user, content) {

  try {

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);

    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists(user);
    if (!userExists) {
        console.log('An identity for the user ' + user + ' does not exist in the wallet');
        console.log('Run the registerUser.js application before retrying');
        return;
    }

    var hashToAction = CryptoJS.SHA256(content).toString();
    console.log("Hash of the file: " + hashToAction);

    // extract certificate info from wallet

    const walletContents = await wallet.export(user);
    const userPrivateKey = walletContents.privateKey;

    var sig = new KJUR.crypto.Signature({"alg": "SHA256withECDSA"});
    sig.init(userPrivateKey, "");
    sig.updateHex(hashToAction);
    var sigValueHex = sig.sign();
    var sigValueBase64 = new Buffer(sigValueHex, 'hex').toString('base64');
    console.log("Signature: " + sigValueBase64);

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: user, discovery: { enabled: false } });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');

    // Get the contract from the network.
    const contract = network.getContract('docrec');

    // Submit the specified transaction.
    await contract.submitTransaction('createDocRecord', hashToAction, sigValueBase64);

    const transactionResult = 'Transaction has been submitted';
    console.log(transactionResult);

    // Disconnect from the gateway.
    await gateway.disconnect();

    return transactionResult;

  } catch (error) {

    const details = `Failed to submit transaction: ${error}`;
    console.error(details);
    return details;

  }

}

/**
 * @api {get} /doc/add Store non-repudable content
 * @apiName NR
 * @apiGroup Store
 *
 * @apiParam {body} NR payload.
 *
 */
router.post('/add', function(req, res, next) {

  add("alice", req.body).then((result) => res.send(result));

});

async function validate(user, content, certfile) {

  try {

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);

    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists(user);
    if (!userExists) {
        console.log('An identity for the user ' + user + ' does not exist in the wallet');
        console.log('Run the registerUser.js application before retrying');
        return;
    }

    var hashToAction = CryptoJS.SHA256(content).toString();
    console.log("Hash of the file: " + hashToAction);

    // get certificate from the certfile
    const certLoaded = fs.readFileSync(certfile, 'utf8');

    // retrieve record from ledger

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: user, discovery: { enabled: false } });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');

    // Get the contract from the network.
    const contract = network.getContract('docrec');

    // Submit the specified transaction.
    const result = await contract.evaluateTransaction('queryDocRecord', hashToAction);
    console.log("Transaction has been evaluated");
    var resultJSON = JSON.parse(result);
    console.log("Doc record found, created by " + resultJSON.time);
    console.log("");

    // Show info about certificate provided
    const certObj = new X509();
    certObj.readCertPEM(certLoaded);
    console.log("Detail of certificate provided")
    console.log("Subject: " + certObj.getSubjectString());
    console.log("Issuer (CA) Subject: " + certObj.getIssuerString());
    console.log("Valid period: " + certObj.getNotBefore() + " to " + certObj.getNotAfter());
    console.log("CA Signature validation: " + certObj.verifySignature(KEYUTIL.getKey(caCert)));
    console.log("");

    // perform signature checking
    var userPublicKey = KEYUTIL.getKey(certLoaded);
    var recover = new KJUR.crypto.Signature({"alg": "SHA256withECDSA"});
    recover.init(userPublicKey);
    recover.updateHex(hashToAction);
    var getBackSigValueHex = new Buffer(resultJSON.signature, 'base64').toString('hex');
    const valid = recover.verify(getBackSigValueHex);
    console.log("Signature verified with certificate provided: " + valid);

    // perform certificate validation
    // var caPublicKey = KEYUTIL.getKey(caCert);
    // var certValidate = new KJUR.crypto.Signature({"alg": "SHA256withECDSA"});
    // certValidate.init(caPublicKey);
    // certValidate.update

    // Disconnect from the gateway.
    await gateway.disconnect();

    return valid;

  } catch (error) {

    const details = `Failed to evaluate transaction: ${error}`;
    console.error(details);
    return details;

  }

}

/**
 * @api {get} /doc/validate Validate non-repudable content
 * @apiName NR
 * @apiGroup Validate
 *
 * @apiParam {body} NR payload.
 *
 */
router.post('/validate', function(req, res, next) {

  console.log(req.body);
  validate("alice", req.body, "wallet/alicecert").then((result) => res.send(result));

});

module.exports = router;
