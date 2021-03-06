define({ "api": [
  {
    "type": "post",
    "url": "/bucket/add",
    "title": "Store non-repudable content in an AWS S3-style bucket",
    "name": "NR",
    "group": "Store",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "body",
            "optional": false,
            "field": "NR",
            "description": "<p>payload.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./api/routes/bucket.js",
    "groupTitle": "Store"
  },
  {
    "type": "post",
    "url": "/chain/add",
    "title": "Store non-repudable content",
    "name": "NR",
    "group": "Store",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "body",
            "optional": false,
            "field": "NR",
            "description": "<p>payload.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./api/routes/chain.js",
    "groupTitle": "Store"
  },
  {
    "type": "post",
    "url": "/selinux/add",
    "title": "Store non-repudable content in an selinux protected file",
    "name": "NR",
    "group": "Store",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "body",
            "optional": false,
            "field": "NR",
            "description": "<p>payload.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./api/routes/selinux.js",
    "groupTitle": "Store"
  },
  {
    "type": "get",
    "url": "/chain/validate",
    "title": "Validate non-repudable content",
    "name": "NR",
    "group": "Validate",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "body",
            "optional": false,
            "field": "NR",
            "description": "<p>payload.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./api/routes/chain.js",
    "groupTitle": "Validate"
  }
] });
