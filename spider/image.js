//����ģ��
var request = require('request');
var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var news = [];//�������html�������
var linklist = require('./data/news');
//console.log(linklist[0].link);
//����http get����
var j = 0;
for(var i = 0; i < 500; i++) {
    linklist[i].link = encodeURI(linklist[i].link);
    http.get(linklist[i].link, function (res) {
        var html = '';//����ץȡ����htmlԴ��

        res.setEncoding('utf-8');

        res.on('data', function (chunk) {
            html += chunk;

            res.on('end', function () {
                //console.log(html);
                var $ = cheerio.load(html);

                $('.article-content img').each(function (index, item) {
                    var iurl = $(this).attr('src');
                    var iname = $(this).parent().next().text().trim();

                    if (iname.length >= 20 || iname == "") {
                        iname = "Null" + j;
                        j++;
                    }
                    iname = iname + '.jpg';
                    console.log(iname);
                    var imageurl = 'http://www.ss.pku.edu.cn' + iurl;
                    console.log(imageurl);
                    fetchImg(imageurl, iname, function () {
                        console.log(iname + ' done');
                    });

                })
            });
        });

    }).on('error', function (err) {
        console.log(err);
    });
}
var fetchImg = function(url, filename){
    request.head(url, function(err, res, body){
        if (err) {
            console.log('err: '+ err);
            return false;
        }
        console.log('res: '+ res);
        request(url).pipe(fs.createWriteStream('./data/image/'+filename));//.on('close', callback);  //����request�Ĺܵ������ص� images�ļ�����
    });
};


