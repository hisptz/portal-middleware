const express = require("express");
const router = express.Router();
const fs = require("fs");
const configurationsRaw = fs.readFileSync("config.json");
const configurations = JSON.parse(configurationsRaw);
const request = require("request");

const lookup = {};

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// route with regular Expression to escape some characters
router.get(/\/(\d*)\/?(edit)?/, function(req, res, next) {
  console.log("gdd", req.url);
  const middlewareKey = req.url.split("/")[1];
  // const instanceType = req.url.split("/")[2];
  const baseUrl = configurations["instance"];
  const credentials =
    configurations["username"] + ":" + configurations["password"];
  const path = req.url.replace("/" + middlewareKey, "");
  // define headers
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Basic " + new Buffer.from(credentials).toString("base64")
  };
  const Promise = require("promise");

  const uri = baseUrl + path;
  const promise =
    uri.indexOf("api") == -1
      ? new Promise(function(resolve, reject) {})
      : new Promise(function(resolve, reject) {
          request(
            {
              headers: headers,
              uri,
              method: "GET"
            },
            function(error, response, body) {
              if (!error && response.statusCode == 200) {
                const receivedContent = JSON.parse(body);
                resolve(receivedContent);
              } else {
                if (response) {
                  console.log(response.statusCode + ":", JSON.stringify(error));
                  reject();
                } else {
                  console.log(response);
                }
              }
            }
          );
        });
  // send when the results are completely loaded
  promise.then(function(result) {
    res.send(result);
  });
});

router.put(/\/(\d*)\/?(edit)?/, function(req, res, next) {
  const data = req.body;
  const middlewareKey = req.url.split("/")[1];
  const baseUrl = configurations["instance"];
  const credentials =
    configurations["username"] + ":" + configurations["password"];
  const path = req.url.replace("/" + middlewareKey, "");
  // define headers
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Basic " + new Buffer.from(credentials).toString("base64")
  };

  const Promise = require("promise");
  const promise = new Promise(function(resolve, reject) {
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
});
module.exports = router;
