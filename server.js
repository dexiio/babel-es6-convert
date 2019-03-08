const express = require('express');
const request = require('request');
const babel = require("@babel/core");
const Cache = require('memory-cache');

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8899;
const CACHE_TTL = process.env.CACHE_TTL ? parseInt(process.env.CACHE_TTL) : (15 * 60 * 1000);

const babelOptions = require('./babel.config');
const HEADER_COPY = ['referer','cookie','user-agent'];

const app = express();

function sendResponse(respObj, res) {

    respObj.headers.forEach((header) => {
        res.set(header.name, header.value);
    });

    res.send(respObj.body);
}

app.get('/', function(req, res) {

    let jsUrl = req.query.url;

    if (!jsUrl && req.headers['x-original-url']) {
        jsUrl = decodeURIComponent(req.headers['x-original-url']);
    }

    if (!jsUrl) {
        res.status(400)
            .send('Missing url (query parameter "?url=" or header "X-Original-Url")');
    }


    let respObj = Cache.get(jsUrl);
    if (respObj) {
        sendResponse(respObj, res);
        return;
    }

    let reqOpts = {
        url: jsUrl,
        headers: {}
    };

    HEADER_COPY.forEach(function(headerName) {
        if (req.headers[headerName]) {
            reqOpts.headers[headerName] = req.headers[headerName];
        }
    });

    request(reqOpts, function(err, urlResp, body) {

        if (err) {
            res.status(500)
                .send(err.toString());
            return;
        }

        babel.transform(body, babelOptions, function(err, result) {
            if (err) {
                res.status(500)
                    .send(err.toString());
                return;
            }

            respObj = {
                body: result.code,
                headers: [
                    {name: 'Content-Type', value: 'application/javascript'}
                ]
            };

            HEADER_COPY.forEach(function(headerName) {
                if (urlResp.headers[headerName]) {
                    respObj.headers.push({
                        name: headerName,
                        value: urlResp.headers[headerName]
                    });
                }
            });

            Cache.put(jsUrl, respObj, CACHE_TTL);

            sendResponse(respObj, res);
        });
    });
});

app.listen(PORT, () => console.log(`ES6 converter listening on port ${PORT}!`));