//����ģ��
var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');

//����http get����
http.get("http://www.ss.pku.edu.cn/index.php/newscenter/news",function(res){
	var html = '';//����ץȡ����htmlԴ��
	var news = [];//�������html�������
	res.setEncoding('utf-8');

	//ץȡҳ������
	res.on('data',function(chunk){
		html += chunk;
	});

	//��ҳ����ץȡ���
	res.on('end',function(){
		//console.log(html);
		var $ = cheerio.load(html);

		//ͨ��ѡ����$('#info-list-ul li')����Ҫ������ȡ����ͨ��each����ѭ��ȡ��item�е�ÿ������
		$('#info-list-ul li').each(function(index,item){
			var news_item = {
				title:$('.info-title',this).text(),//��ȡ���ű���
				time:$('.time',this).text(),//��ȡ����ʱ��
				link:'http://www.ss.pku.edu.cn'+$('a',this).attr('href'),//��ȡ������������
			};
			//���������ŷ���һ����������
			news.push(news_item);
			console.log(news_item);
		});
	//	console.log(news);
		saveData('data/data.json',news);
		readData('data/data.json');
	});

}).on('error',function(err){
	console.log(err);
});

//�������ݵ�����
function saveData(path,news){
	fs.writeFile(path,JSON.stringify(news,null,4),function(err){
		if(err){
			return console.log(err);
		}
		console.log('Data saved');
	});
}

//��ȡ����
function readData(path){
	fs.readFile(path,{encoding:'utf-8'},function(err,bytesRead){
		if(err)
			console.log(err);
		else{
			var data = JSON.parse(bytesRead);
			console.log(data);
			console.log("readData success");
		}
	});
}


