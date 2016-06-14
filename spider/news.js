//����ģ��
var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var news = [];//�������html�������
//����http get����
for(var i = 0; i < 500; i += 20){
	http.get("http://www.ss.pku.edu.cn/index.php/newscenter/news?start=" + i,function(res){
		var html = '';//����ץȡ����htmlԴ��

		res.setEncoding('utf-8');

		res.on('data',function(chunk){
			html += chunk;
		});

		res.on('end',function(){
			//console.log(html);
			var $ = cheerio.load(html);

			$('#info-list-ul li').each(function(index,item){
				var news_item = {
					title:$('.info-title',this).text(),//��ȡ���ű���
					time:$('.time',this).text(),//��ȡ����ʱ��
					link:'http://www.ss.pku.edu.cn'+$('a',this).attr('href'),//��ȡ������������
				};
				news.push(news_item);
				console.log(news_item);
			});
			console.log(news);
			saveData('data/news.json',news);
		});

	}).on('error',function(err){
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



