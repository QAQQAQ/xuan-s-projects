var http   = require('http');    
var fs     = require('fs');    
var url    = require('url');    
var path   = require('path');    
var FServer   = require('./FServer'); 

function onRequest(req, res){    
	// 取得文件路径    
	var pathname = url.parse(req.url).pathname;    
	// 获取文件扩展名(包含前置.)    
	var extname = path.extname( pathname );    
	var type = extname.slice(1);    
	// 获取下载文件在磁盘上的路径，    
	var realPath = '../' + pathname;   
    FServer.filesLoad(realPath, type, req, res);
}       
http.createServer(onRequest).listen(80);     
console.log("server started");