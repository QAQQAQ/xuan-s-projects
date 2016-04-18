/**
 * Created by lenovo on 2016/4/15.
 */
var PORT=8070;
var http=require('http');
var qs=require('qs');

var TOKEN='millie';

function checkSignature(params,token){
    var key=[token,params.timestamp,params.nonce].sort().join('');
    var sha1=require('crypto').createHash('sha1');
    sha1.update(key);
    System.out.println("params"+sha1.digest('hex'));
    return sha1.digest('hex')==params.signature;
}

var server=http.createServer(function(req,res){
    var query=require('url').parse(req.url).query;
    var params=qs.parse(query);

    console.log(params);
    console.log("token-->",TOKEN);

    if(checkSignature(params,TOKEN)){
        res.end(params.echostr);
    }else{
        response.end('signature fail');
    }
});

server.listen(PORT);
console.log("Server running at port"+PORT+".");