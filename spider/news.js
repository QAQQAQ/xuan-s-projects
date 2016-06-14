//引入模块
var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var news = [];//保存解析html后的数据
//创建http get请求
for(var i = 0; i < 500; i += 20){
	http.get("http://www.ss.pku.edu.cn/index.php/newscenter/news?start=" + i,function(res){
		var html = '';//保存抓取到的html源码

		res.setEncoding('utf-8');

		res.on('data',function(chunk){
			html += chunk;
		});

		res.on('end',function(){
			//console.log(html);
			var $ = cheerio.load(html);

			$('#info-list-ul li').each(function(index,item){
				var news_item = {
					title:$('.info-title',this).text(),//获取新闻标题
					time:$('.time',this).text(),//获取新闻时间
					link:'http://www.ss.pku.edu.cn'+$('a',this).attr('href'),//获取新闻详情链接
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

//保存数据到本地
function saveData(path,news){
	fs.writeFile(path,JSON.stringify(news,null,4),function(err){
		if(err){
			return console.log(err);
		}
		console.log('Data saved');
	});
}



