var express = require('express');
var router = express.Router();
const cheerio = require('cheerio');
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
    var path = req.url.replace('/middleware','');
    // see the path
    var urlExtract = '';
    console.log('PATH middleware', path);
    if (path.indexOf('extract') > 0) {
        console.log('extract');
        if (path.indexOf('who-factbuffects') > 0) {
            urlExtract = 'http://www.who.int/gho/en/'
        } else {
            urlExtract = 'http://nacp.go.tz/site/news/HSHSPIIIcostingreportFINAL.json';
        }
        var Promise = require('promise');
        var promise = new Promise(function (resolve, reject) {
            var headers = {
                'Content-Type':  'application/text',
                "Authorization": 'Basic ' + new Buffer.from(credentials).toString('base64')
            }
            request({
                    headers: headers,
                    uri: urlExtract,
                    method: 'GET'
                },
                function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        $=cheerio.load(body);
                        $('a').each(function (index, val) {
                            $(val).attr('target', '_blank');
                            $(val).attr('style', 'color: #2A8FD1; font-size: 0.8em;');
                        });
                        $('.panel-success').each(function (index, successDom) {
                            $(successDom).replaceWith('');
                        });
                        $('.panel-title').replaceWith('<h3 style="text-align: left; margin-top: 20px; font-weight: 500; font-size: 1.4em;">More news from NACP news page</h3>');
                        $('#factbuffets h2').replaceWith('<h3 style="color: #2A8FD1;">fact buffet (from GHO)</h3>')
                        var extractedData = '';
                        if (path.indexOf('who-factbuffects') > 0) {
                            extractedData = $('#factbuffets');
                        } else {
                            extractedData = $('.main-content .col-lg-8').replaceWith('').removeAttr('class');
                        }
                        var data = {
                            "data": extractedData.toString()
                        }
                        resolve(data);
                    } else {
                        if (response) {
                            console.log(error);
                            reject();
                        } else {
                            console.log(response);
                        }
                    }
                })
        });
    } else {
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
    }
// send when the results are completely loaded
    promise.then(function(result) {
        res.send(result);
    });
});

module.exports = router;
