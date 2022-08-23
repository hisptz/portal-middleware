const express = require("express");
const router = express.Router();
const configurations = require("../config/config");
const request = require("request");
const Promise = require("promise");

const lookup = {};
// route with regular Expression to escape some characters
router.get(/\/(\d*)\/?(edit)?/, (req, res, next) => {
  const baseUrl = configurations["instance"];
  const credentials =
    configurations["username"] + ":" + configurations["password"];
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: "Basic " + new Buffer.from(credentials).toString("base64"),
  };

  var path = req.url.replace(configurations.replaceKey, "");

  if (path.includes("/api/me?")) {
    path = "/api/users.json/" + configurations.id;
  }

  const uri = baseUrl + path;
  const availableContent = lookup[uri];
  const promise = availableContent
    ? new Promise(function (resolve, reject) {
        resolve(availableContent);
      })
    : new Promise(function (resolve, reject) {
        request(
          {
            headers: headers,
            uri,
            method: "GET",
          },
          function (error, response, body) {
            if (!error && response.statusCode == 200) {
              const receivedContent = JSON.parse(body);
              lookup[uri] = receivedContent;
              resolve(receivedContent);
            } else {
              if (response) {
                console.log(response.statusCode + ":", JSON.stringify(error));
                console.log("RESPONSE", response);
                reject();
              }
              reject();
            }
          }
        );
      });
  // send when the results are completely loaded
  promise.then(function (result) {
    res.send(result);
  });
});

router.put(/\/(\d*)\/?(edit)?/, function (req, res, next) {
  const data = req.body;
  const middlewareKey = req.url.split("/")[1];
  const baseUrl = configurations["instance"];
  const credentials =
    configurations["username"] + ":" + configurations["password"];
  const path = req.url.replace("/portal-middleware-live", "");
  // define headers
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: "Basic " + new Buffer.from(credentials).toString("base64"),
  };

  const Promise = require("promise");
  const promise = new Promise(function (resolve, reject) {
    request(
      {
        headers: headers,
        url: baseUrl + path,
        method: "PUT",
        json: true,
        body: data,
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

  promise.then(function (result) {
    res.send(result);
  });
});
module.exports = router;
