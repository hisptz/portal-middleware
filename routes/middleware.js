var express = require('express');
var router = express.Router();
/**
 * TODO: Server address and credentials should be configured in configuration file
*/
var URL = 'server address';
var credentials = 'username:password';

var request = require('request');

// route with regular Expression to escape some characters
router.get(/\/(\d*)\/?(edit)?/, function(req, res, next) {
    // define headers
    var headers = {
        'Content-Type': 'application/json',
        "Authorization": 'Basic ' + new Buffer.from(credentials).toString('base64')
    }

    // replace portal-middleware with the path of here your portal reference
    /**
     * *TODO: put this in the configuration file
     */
    var path = req.url.replace('/portal-middleware','');
    // see the path
    console.log('PATH middleware', path);
    var Promise = require('promise');
    var promise = new Promise(function (resolve, reject) {
        request({
                headers: headers,
                uri: URL + path,
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

module.exports = router;
