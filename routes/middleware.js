const express = require('express');
const router = express.Router();
const fs = require('fs');
const configurationsRaw = fs.readFileSync('config.json');
const configurations = JSON.parse(configurationsRaw)
const request = require('request');

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

// route with regular Expression to escape some characters
router.get(/\/(\d*)\/?(edit)?/, function(req, res, next) {
    const middlewareKey = req.url.split('/')[1]
    const instanceType = req.url.split('/')[2];
    const baseUrl = configurations[instanceType]['instance'];
    const credentials = configurations[instanceType]['username'] + ':' + configurations[instanceType]['password'];
    const path = req.url.replace('/' + middlewareKey,'').replace('/' + instanceType, '');
    console.log(baseUrl + path)
    // define headers
    const headers = {
        'Content-Type': 'application/json',
        "Authorization": 'Basic ' + new Buffer.from(credentials).toString('base64')
    }
    const Promise = require('promise');
    const promise = new Promise(function (resolve, reject) {
        request({
                headers: headers,
                uri: baseUrl + path,
                method: 'GET'
            },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    resolve(JSON.parse(body));
                } else {
                    if (response) {
                        console.log(response.statusCode + ":", JSON.stringify(error));
                        reject();
                    } else {
                        console.log(response);
                    }
                }
            })
    });
// send when the results are completely loaded
    promise.then(function(result) {
        res.send(result);
    });
});

router.put(/\/(\d*)\/?(edit)?/, function(req, res, next) {
    const data = req.body;
    const middlewareKey = req.url.split('/')[1]
    const instanceType = req.url.split('/')[2];
    const baseUrl = configurations[instanceType]['instance'];
    const credentials = configurations[instanceType]['username'] + ':' + configurations[instanceType]['password'];
    const path = req.url.replace('/' + middlewareKey,'').replace('/' + instanceType, '');
    // define headers
    const headers = {
        'Content-Type': 'application/json',
        "Authorization": 'Basic ' + new Buffer.from(credentials).toString('base64')
    }

    const Promise = require('promise');
    const promise = new Promise(function (resolve, reject) {
    request(
        {
          headers: headers,
          url: baseUrl + path,
          method: "PUT",
          json: true,
          body: data
        },
        (err, res, body) => {
          if (!err) {
            resolve(body);
          } else {
            reject(err);
          }
        }
      );
});

promise.then(function(result) {
    res.send(result);
});
})
module.exports = router;
