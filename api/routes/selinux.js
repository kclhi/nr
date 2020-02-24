var express = require('express');
var router = express.Router();

/**
 * @api {post} /selinux/add Store non-repudable content in an selinux protected file
 * @apiName NR
 * @apiGroup Store
 *
 * @apiParam {body} NR payload.
 *
 */
router.post('/add', function(req, res, next) {

  const { spawn } = require('child_process');

  // Add IP address of vagrant machine.
  var ssh = spawn( 'ssh', ['-i', '../selinux/_vagrant/keys/vagrant', '-p', '22', 'vagrant@192.168.1.136', 'echo "' + JSON.stringify(req.body) + '" >> /home/vagrant/store/tokens']);

  ssh.stdout.on('data', (data) => {

    console.log(`stdout: ${data}`);

  });

  ssh.stderr.on('data', (data) => {

    console.error(`stderr: ${data}`);

  });

  ssh.on('close', (code) => {

    res.end();

  });

});

module.exports = router;
