/**
 * Created by lenovo on 2016/6/7.
 */
function replyText(msg, replyText){
    //��Ҫ���ص���Ϣͨ��һ���򵥵�tmplģ�壨npm install tmpl������΢��
    var tmpl = require('tmpl');
    var replyTmpl = '<xml>'+
        '<ToUserName><![CDATA[toUser]]></ToUserName>'+
        '<FromUserName><![CDATA[fromUser]]></FromUserName>'+
        '<CreateTime><![CDATA[time]]></CreateTime>' +
        '<MsgType><![CDATA[type]]></MsgType>'+
        ' <Content><![CDATA[content]]></Content>'+
        '</xml>';

    return tmpl(replyTmpl, {
        toUser: msg.xml.FromUserName[0],
        fromUser: msg.xml.ToUserName[0],
        type: 'text',
        time: Dte.now(),
        content: replyText
    });
}

module.exports = {
    replyText: replyText
};