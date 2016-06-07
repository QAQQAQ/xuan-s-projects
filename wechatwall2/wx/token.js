/**
 * Created by lenovo on 2016/5/31.
 */
var request = require('request');
var fs = require('fs');

function getToken(appID, appSecret){
    return new Promise(function(resolve, reject){
        var token;

        if(fs.existsSync('token.dat')){
            token = JSON.parse(fs.readFileSync('token.dat'));
        }

        if(!token || token.timeout < Date.now()){
            request('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+ appID + '&secret=' + appSecret, function (err, res, data) {
                var result = JSON.parse(data);
                result.timeout = Date.now() + 7200000;
                fs.writeFileSync('token.dat', JSON.stringify(result));
                resolve(result);
            });
        }else{
            resolve(token);
        }
    });
}module.exports = {
    getToken: getToken
};