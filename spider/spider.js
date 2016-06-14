//引入模块
var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');

//创建http get请求
http.get("http://www.ss.pku.edu.cn/index.php/newscenter/news",function(res){
	var html = '';//保存抓取到的html源码
	var news = [];//保存解析html后的数据
	res.setEncoding('utf-8');

	//抓取页面内容
	res.on('data',function(chunk){
		html += chunk;
	});

	//网页内容抓取完毕
	res.on('end',function(){
		//console.log(html);
		var $ = cheerio.load(html);

		//通过选择器$('#info-list-ul li')将需要的数据取出，通过each方法循环取出item中的每个数据
		$('#info-list-ul li').each(function(index,item){
			var news_item = {
				title:$('.info-title',this).text(),//获取新闻标题
				time:$('.time',this).text(),//获取新闻时间
				link:'http://www.ss.pku.edu.cn'+$('a',this).attr('href'),//获取新闻详情链接
			};
			//把所有新闻放在一个数组里面
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

//保存数据到本地
function saveData(path,news){
	fs.writeFile(path,JSON.stringify(news,null,4),function(err){
		if(err){
			return console.log(err);
		}
		console.log('Data saved');
	});
}

//读取数据
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


