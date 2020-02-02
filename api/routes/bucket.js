var express = require('express');
var router = express.Router();
var Minio = require('minio')

function addFileToBucket(minioClient, content) {

  // Upload a string
  minioClient.putObject('nr-api', "o" + Date.now(), content, 'text/plain', function(err, etag) {

    if (err) return console.log(err)

    console.log('File uploaded successfully.')

  });

}

/**
 * @api {post} /bucket/add Store non-repudable content in an AWS S3-style bucket
 * @apiName NR
 * @apiGroup Store
 *
 * @apiParam {body} NR payload.
 *
 */
router.post('/add', function(req, res, next) {

  // Instantiate the minio client with the endpoint
  // and access keys as shown below.
  var minioClient = new Minio.Client({
      endPoint: 'localhost',
      port: 9001,
      useSSL: true,
      accessKey: 'minio',
      secretKey: 'minio123'
  });

  minioClient.bucketExists('nr-api', function(err, exists) {

    if (err) {

      return console.log(err)

    }

    if (exists) {

      console.log('Bucket exists.')

      addFileToBucket(minioClient, req.body);

    } else {

      minioClient.makeBucket('nr-api', 'us-east-1', function(err) {

          if (err) return console.log(err)

          console.log('Bucket created successfully in "us-east-1".')

          addFileToBucket(minioClient, req.body);

      });

    }

  })

  res.end();

});

module.exports = router;
