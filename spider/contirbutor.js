//����ģ��
var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var news = [];//�������html�������
var linklist = require('./data/news');
//console.log(linklist[0].link);
//����http get����

for(var i = 0; i < 500; i++) {
    linklist[i].link = encodeURI(linklist[i].link);
    http.get(linklist[i].link, function (res) {
        var html = '';//����ץȡ����htmlԴ��

        res.setEncoding('utf-8');

        res.on('data', function (chunk) {
            html += chunk;
        });

        res.on('end', function () {
            //console.log(html);
            var $ = cheerio.load(html);
            var news_item = {
                support: $('.article-info a:first-child').text().trim(),
            };
            //���������ŷ���һ����������
            news.push(news_item);
            console.log(news_item);
            saveData('data/contirbutor.json', news);
        });

    }).on('error', function (err) {
        console.log(err);
    });
}
//�������ݵ�����
function saveData(path,news){
    fs.writeFile(path,JSON.stringify(news,null,4),function(err){
        if(err){
            return console.log(err);
        }
        console.log('Data saved');
    });
}



