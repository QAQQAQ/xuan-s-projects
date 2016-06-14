/**
 * Created by lenovo on 2016/3/26.
 */
//Server.js
var http = require("http");
http.createServer(function(request, response) {
    console.log('request received');
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Hello ZhaoXuan");
    response.end();
}).listen(8888);
console.log('server started');