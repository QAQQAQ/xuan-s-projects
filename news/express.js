/**
 * Created by lenovo on 2016/4/8.
 */
var express = require('express');
var path = require('path');
var fs = require('fs');

var app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));


function serveStatic(root){
    return function (req, res, next) {
        var file = req.originalUrl.slice(req.baseUrl.length + 1);
        file = path.normalize(file);
        file = path.join(root, file);
        fs.stat(file, function(err, stat) {
            if(err == null ) {
                if(stat.isFile()){
                    var stream = fs.createReadStream(file);
                    stream.pipe(res);
                }else if(stat.isDirectory()){
                    var url = req.originalUrl;
                    if(url[url.length-1] === '/'){
                        res.redirect(req.originalUrl + "index.html");
                    }else{
                        res.redirect(req.originalUrl + "/index.html");
                    }
                }
            } else {
                console.log('文件不存在');
                res.writeHead(200,{
                    'content-type':'text/html;charset=utf-8'
                });
                res.end('<h1 style="color:red;">您查找的文件不存在！</h1>');
                next();
            }
        });
    };
}

app.use('/public', serveStatic(__dirname + '/public'));
//app.use('/public', express.static(__dirname + '/public'));

function getNewsList(){
    var list = [];
    for(var i =0; i < 10; i++){
        list.push(getNewsById(i+1));
    }
    return list;
}

function getNewsById(id){
    return{
        id: id,
        title: '第'+ id + '篇新闻标题',
        content: '第' + id + '篇新闻内容'
    };
}

app.get('/', function (req, res){
    res.render('index.ejs',{
        list: getNewsList()
    });
});

app.get('/news/:id', function(req, res){
    res.render('news.ejs',{
        news:getNewsById(req.params.id)
    });
});

app.listen(3001);