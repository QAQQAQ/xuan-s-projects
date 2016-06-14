/**
 * Created by lenovo on 2016/3/14.
 */
//var http = require("http");
//var url = require("url");

//function route(handle, pathname, response, postData){
function route(handle, pathname, response, request){
    console.log("About to route a request for " + pathname);
    if(typeof  handle[pathname] === 'function'){
        //handle[pathname](response,postData);
        handle[pathname](response, request);
    }else{
        console.log("No request handler found for" + pathname);
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write("404 Not found");
        response.end();
    }
}
exports.route = route;