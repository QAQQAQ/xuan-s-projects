/**
 * Created by lenovo on 2016/6/7.
 */
//΢��ǽ��˳���
var http = require('http');
var qs = require('qs');
var config = require('../config');
var checkSignature = require('./check');
var io = require('../service/wxapp');
var getUserInfo = require('./userInfo').getUserInfo();
var replyText = require('./reply').replyText;

var server = http.createServer(function (request, response) {
    //����URL�е�query���֣���qsģ��(npm install qs)��query������json
    var query = require('url').parse(request.url).query;
    var params = qs.parse(query);
    if(!checkSignature(params, config, token)){
        response.end('signature  fail');
        return;
    }
    if(request.method == 'GET'){
    //���������GET������echostr����ͨ����������ЧУ��
        response.end(params.echostr);
    }else{
        //������΢�Ÿ������߷�������POST����
        var postdata = '';
        request.addListener("data", function (postchunk) {
            postdata += postchunk;
        });
        //��ȡ����POST����
        request.addListener("end", function () {
            //��XML�ַ���ת��Ϊjson
            parseString(postdata, function (err, result) {
                if(err){
                    console.log(err);
                }else{
                    textMessage(result, response);
                }
            });
        });
    }
});
function textMessage(result, response){
    //��openID����û���Ϣ
    getUserInfo(result.xml.FromUserName[0])
        .then(function (userInfo) {
            //��ȡ�û���Ϣ���ϲ�����Ϣ��
            console.log("ddddddddddd")
            result.user = userInfo;
            //����Ϣͨ��websocket�㲥
            io.message.push(reslut.xml.Content[0]);
            io.socket.emit("message", result.xml.Content[0]);
            var res = replyText(result, '��Ϣ���ͳɹ���');
            response.end(res);
        });
    server.listen(config.wxPort);
}