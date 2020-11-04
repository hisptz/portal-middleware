const express = require("express");
const router = express.Router();
const fs = require("fs");
const configurationsRaw = fs.readFileSync("config.json");
const configurations = JSON.parse(configurationsRaw);
const request = require("request");

const lookup = {};

// route with regular Expression to escape some characters
router.get(/\/(\d*)\/?(edit)?/, function(req, res, next) {
  console.log(req.url.split("/"))
  const middlewareKey = req.url.split("/")[1];
  const baseUrl = configurations["instance"];
  const credentials =
    configurations["username"] + ":" + configurations["password"];
  // define headers
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Basic " + new Buffer.from(credentials).toString("base64")
  };

  var path = req.url.replace("/middleware", "");
  console.log(path)
  const Promise = require("promise");

  const uri = baseUrl + path;
  const availableContent = lookup[uri];
  const promise = availableContent
    ? new Promise(function(resolve, reject) {
        resolve(availableContent);
      })
    : new Promise(function(resolve, reject) {
        request(
          {
            "rejectUnauthorized": false,
            headers: headers,
            uri,
            method: "GET"
          },
          function(error, response, body) {
            console.log("here", JSON.stringify(body))
            if (!error && response.statusCode == 200) {
              const receivedContent = JSON.parse(body);
              // console.log(receivedContent)
              // lookup[uri] = receivedContent;
              resolve(receivedContent);
            } else {
              // console.log('response', response)
              if (response) {
                // console.log(response.statusCode + ":", JSON.stringify(error));
                reject();
              } else {
                // console.log(response);
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
  const path = req.url.replace("/portal-middleware-live", "");
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
