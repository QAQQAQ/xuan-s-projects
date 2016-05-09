/**
 * Created by lenovo on 2016/3/29.
 */
//加载依赖库
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var crypto = require('crypto');
//console.log(crypto.getHashes()); // 打印支持的hash算法
var session = require('express-session');
var moment = require("moment");
var checkLogin = require('./checkLogin.js');

////引入mongoose
//var mongoose = require('mongoose');
//
////引入模型
//var models = require('./models/models');
//
//var User = models.User;
//var Note = models.Note;
//
////使用mongoose连接服务
//mongoose.connect('mongodb://123.206.71.158:27017/notes');
//mongoose.connection.on('error',console.error.bind(console,'连接数据库失败'));

//mysql
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'mynote',
    password: '123456',
    database: 'mynote'
});


//创建express实例
var app = express();

//定义EJS模板引擎和模板文件位置
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

//定义静态文件目录
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'scripts')));

//定义数据解析器
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//建立session模型
 app.use(session({
     secret: '1234',
     name: 'mynote',
     cookie: {maxAge: 1000 * 60 * 60 * 24 * 7},//session保存时间7天
     resave: true,
     saveUninitialized: true
 }));


//响应首页get请求
app.get('/',checkLogin.noLogin);
app.get('/',function(req, res){
    console.log(req.session.user);
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        var query = connection.query('SELECT * FROM note WHERE author=?', req.session.user.username, function (err, allNotes) {
            if(err){
                console.log(err);
                return res.redirect('/');
                throw err;
            }
            console.log('return', allNotes);
            res.render('index',{
                title: '首页',
                user: req.session.user,
                notes: allNotes
            });
            connection.release();
        });
        console.log(query.sql);
    });
});

//intro page
app.get('/introPage',function(req, res){
    console.log('introPage！');
    res.render('intro.ejs');
});

//响应注册页面get请求
app.get('/register',function(req, res){
  if(req.session.user){
    console.log('用户已登陆！');
    return res.redirect('/');
  }
    console.log('注册！');
    res.render('register',{
        user: req.session.user,
        title: '注册',
        err: '',
        msg: ''
    });
});
pool.getConnection(function (err, connection) {
    if (err) throw err;
    var value = 'jia';
    var query = connection.query('SELECT * FROM user WHERE username=?', value, function (err, ret) {
        if (err) throw err;
        console.log(ret);
        connection.release();
    });
    console.log(query.sql);
});
//post请求
app.post('/register',function(req, res){
    //req.body可以获取到表单的每项数据
    var username = req.body.username || '',
        password = req.body.password || '',
        passwordRepeat = req.body.passwordRepeat || '';

    //检查输入的用户名是否为空，使用trim去掉两端空格
    if(username.trim().length === 0){
        console.log('用户名不能为空！');
        return res.send('用户名不能为空！');
    }
    //
    if(password.trim().length === 0 || passwordRepeat.trim().length === 0){
        console.log('密码不能为空！');
        return res.send('密码不能为空！');
    }

    //检查两次输入的密码是否一致
    if(password != passwordRepeat){
        console.log('两次输入的密码不一致！');
        return res.send('两次输入的密码不一致！');
    }
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        var value = username;
        var query = connection.query('SELECT * FROM user WHERE username=?', value, function (err, user) {
            if (err) throw err;
                console.log('return',user);
                if(user.length){
                    console.log('用户名已经存在');
                    return res.send('用户名已经存在');
                }

                //对密码进行md5加密
                var md5 = crypto.createHash('md5'),
                    md5password = md5.update(password).digest('hex');
            connection.query( 'INSERT INTO user(username, password) values(?, ? )', [username, md5password], function (err, user) {
                if(err){
                    console.log(err);
                    return res.send(err);
                }
                console.log(user);
                req.session.user = user[0];
                return res.send('success');
            });
            console.log(user);
            connection.release();
        });
        console.log(query.sql);
    });
});

app.get('/login',function(req, res){
  console.log(req.session);
  if(req.session.user){
    console.log('用户已登陆！');
    return res.redirect('/');
  }
    console.log('登录！');
    res.render('login',{
        user: req.session.user,
        title: '登录'
    });
});
app.post('/login',function(req, res){
    var username = req.body.username || '',
        password = req.body.password || '';

    pool.getConnection(function (err, connection) {
        if (err) throw err;
        var value = username;
        var query = connection.query('SELECT * FROM user WHERE username=?', value, function (err, user) {
            if (err) throw err;

            console.log('return',user);

            //对密码进行md5加密
            var md5 = crypto.createHash('md5'),
                md5password = md5.update(password).digest('hex');
            if(user[0].password != md5password){
                console.log('密码错误！');
                return res.send('密码错误！');
                // return res.redirect('/login');
            }
            console.log('登录成功！');
            user[0].password = null;
            delete user[0].password;
            req.session.user = user[0];//为了安全起见，将密码删除
            return res.send('success');
            connection.release();
        });
        console.log(query.sql);
    });
});
app.get('/quit',function(req, res){
    req.session.user = null;
    console.log('退出！');
    return res.redirect('/login');
});

app.get('/post',function(req, res){
    console.log('发布！');
    res.render('post',{
        user: req.session.user,
        title: '发布'
    })
});

app.post('/post',function(req, res){
    console.log('session', req.session);
    var currentTime = new Date();
    var note = [
        req.body.title,
        req.session.user.username,
        req.body.tag,
        req.body.content,
        currentTime];
    console.log(currentTime);


    pool.getConnection(function (err, connection) {
        if (err) throw err;
        var query = connection.query('insert into note(title,author,tag,content,createTime) values(?, ?, ?, ?, ?)', note, function (err, allNotes) {
            if(err){
                console.log(err);
                return res.redirect('/post');
            }
            console.log('文章发表成功！');
            return res.redirect('/');
            connection.release();
        });
        console.log(query.sql);
    });
});

app.get('/detail/',function(req, res){
    console.log('查看笔记！');
    res.render('detail',{
        user: req.session.user,
        title:'查看笔记'
    });
});

app.get('/detail/:_id',function(req, res){
    console.log('查看笔记!！', req.params._id);
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        var query = connection.query('select * from note where id = ?', req.params._id, function (err, art) {
            if(err){
                console.log(err);
                return res.redirect('/');
            }
            console.log('artcdfcscsdcsdc', art);
            if(art.length){
                res.render('detail',{
                    title: '笔记详情',
                    user: req.session.user,
                    art: art[0],
                    moment:moment
                });
            }
            connection.release();
        });
        console.log(query.sql);
    });
});
//监听3000端口
app.listen(3000,function(req, res){
    console.log('app is running at port 3000');
});
