/**
 * Created by lenovo on 2016/6/7.
 */
var express = require('express');
var path = require('path');
var fs = require('fs');
var request = require('request');
var config = require('./config');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var session = require('express-session');

var app = express();

app.use(express.static(path.join(__dirname, 'static')));
app.use(cookieParser('rwrwport'));
app.use(bodyParser.json());
app.use(session({
    resave:false,
    saveUninitialized: true,
    secret: 'rwreport',
    cookie:{
        maxAge: 1000*60*60*12
    }
}));
var server = app.listen(config.webPort, function () {
    console.log('listening on the port' + config.webPort);
});
//设置默认访问路径
app.use(function(req, res){
    res.sendFile(path.join(__dirname+'/client/index.html'));
});