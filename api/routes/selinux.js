var express = require('express');
var router = express.Router();

/**
 * @api {get} /selinux/add Store non-repudable content in an selinux protected file
 * @apiName NR
 * @apiGroup Store
 *
 * @apiParam {body} NR payload.
 *
 */
router.post('/add', function(req, res, next) {

  const { spawn } = require('child_process');

  var ssh = spawn( 'ssh', ['-i', '../selinux/_vagrant/keys/vagrant', '-p', '2222', 'vagrant@localhost', 'echo "' + req.body + '" >> /home/vagrant/store/tokens']);

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
