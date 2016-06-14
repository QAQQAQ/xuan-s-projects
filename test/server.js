/**
 * Created by lenovo on 2016/3/14.
 */
var http = require("http");
var url = require("url");

function start(route, handle){
    function onRequest(request, response){
      //  var postData = "";
        var pathname = url.parse(request.url).pathname;
        console.log("Request for" + pathname + "recieved");
        route(handle,pathname,response,request);
        //request.setEncoding("utf8");
        //
        //request.addListener("data", function(postDataChunk){
        //    postData += postDataChunk;
        //    cnosole.log("Received POST data chunk '" + postDataChunk + "'.");
        //});
        //request.addEventListener("end", function(){
        //    route(handle, pathname, response, postData);
        //});
    }
    http.createServer(onRequest).listen(8888);
    console.log("Server has started");
}
exports.start = start;