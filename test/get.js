/**
 * Created by lenovo on 2016/3/26.
 */
//Get.js
var http = require('http');
var options = {
    hostname: '127.0.0.1',
    port: 8888,
    method: 'GET'
};
var req = http.request(options, function (res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
    });
});
console.log('request has been sent.');
req.on('error', function (e) {
    console.log('problem with request: ' + e.message);
});
req.end();