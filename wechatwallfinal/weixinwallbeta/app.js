var express=require('express');
var path=require('path');
var fs=require('fs');
var request=require('request');
var config=require('./config');
var bodyParser=require('body-parser');
var cookieParser=require('cookie-parser');

var session=require('express-session');

var app=express();

app.use(express.static(path.join(__dirname,'static')));
app.use(cookieParser('rwreport'));
app.use(bodyParser.json());
app.use(session({
	secret:'rwreport',
	resave:true,
	saveUninitialized:false,
	cookie:{
		maxAge:1000*60*60*12
	}
}));
var server =app.listen(config.webPort,function(){
	console.log('listen is on port '+config.webPort);
});

//设置默认访问路径
app.use(function(req,res){
	res.sendFile(path.join(__dirname,'./static/index.html'))
});