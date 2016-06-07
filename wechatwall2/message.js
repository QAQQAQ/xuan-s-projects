/**
 * Created by ASUS on 2016/4/12.
 */
//http://123.206.71.158:8060   millie
var PORT=8060;
var token="millie";

var http=require('http');
var qs=require('qs');

function checkSignature(params,token){
    var key=[token,params.timestamp,params.nonce].sort().join('');
    var sha1=require('crypto').createHash('sha1');
    sha1.update(key);
    return sha1.digest('hex')==params.signature;
}

var server=http.createServer(function(request,response){
    console.log("test token url"+require('url').parse(request.url));
    var query=require('url').parse(request.url).query;
    var params=qs.parse(query);

    if(!checkSignature(params,TOKEN)){
        response.end('signature fail');
        return;
    }

    if(request.method=='GET'){
        response.end(params.echostr);
    }else{
        var postData="";
        request.addListener("data",function(postchunk){
            postdata +=postchunk;
        });

        //获取post数据
        request.add("end",function(){
            console.log(postdata);
            response.end('success');
        });
    }

});

server.listen(PORT);
console.log("Server is running at port:"+PORT+".");