/**
 * Created by ASUS on 2016/5/30.
 */
var fs=require('fs');
var request=require('request');
var Promise=require('promise');

/*function getToken(appID,appSecret){
    var token;
    if(fs.existSync('token.dat')){
        token=JSON.parse(fs.readFileSync('token.dat'));
    }
    if(!token || token.timeout<Date.now()) {
        request('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + appID + '&secret=' + appSecret, function (err, res, data) {
            if (!err && res.statusCode == 200) {
                console.log('test token' + data);
                var result = JSON.parse(data);
                result.timeout = Date.now() + 7000;
                fs.writeFileSync('token.dat', JSON.stringify(result));
                return result;
            }
        });
    }
}*/

function getToken(appID,appSecret){
    return new Promise(function(resolve,reject){
        var token;
        if(fs.existsSync('token.dat')){
            token=JSON.parse(fs.readFileSync('token.dat'));
        }
        if(token===undefined || token.timeout<Date.now()){
            request('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+appID+'&secret=' + appSecret,function(err,res,data){
                var result=JSON.parse(data);
                result.timeout=Date.now()+7000000;
                fs.writeFileSync('token.dat',JSON.stringify(result));
                resolve(result);
            });
        }else{
            resolve(token);
        }
    });
}

exports.getToken=getToken;
