var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var session = require('express-session');
var moment = require("moment");
var mysqlAdapter = require('sails-mysql');
var mongoAdapter = require('sails-mongo');
var ejs = require('ejs');

var connections = {
  mysql: {
    adapter: 'mysql',
    host: '123.206.71.158',
    port: 3306,
    user: 'mynote',
    password: '123456',
    database: 'mynote'
  }
};

//mysql
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: '123.206.71.158',
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
 // app.use(session({
 //     secret: '1234',
 //     name: 'mynote',
 //     cookie: {maxAge: 1000 * 60 * 60 * 24 * 7},//session保存时间7天
 //     resave: true,
 //     saveUninitialized: true
 // }));


//发起约车
app.get('/publish',function(req, res){
    console.log('发起约车');
    res.render('publish.ejs');
});

app.get('/publish',function(req, res){
    console.log(req.session.user);
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        var query = connection.query('SELECT * FROM note WHERE author=?', req.session.user.username, function (err, allNotes) {
            if(err){
                console.log(err);
                return res.redirect('/');
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



//响应注册页面get请求
app.get('/',function(req, res){
    res.render('register',{
        title: '注册',
        err: '',
        msg: ''
    });
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
                var currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
            connection.query( 'INSERT INTO user(username, password, createTime) values(?, ? , ?)', [username, md5password, currentTime], function (err, newUser) {
                if(err){
                    console.log(err);
                    return res.send(err);
                }

                console.log('newUser', newUser);
                req.session.user = {
                  username : username
                };
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
            connection.release();
            return res.send('success');
        });
        console.log(query.sql);
    });
});

//监听3000端口
app.listen(8888,function(req, res){
    console.log('app is running at port 8888');
});
