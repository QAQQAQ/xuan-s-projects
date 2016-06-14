/**
 * Created by lenovo on 2016/5/31.
 */
module.exports = function (app) {

    app.get('/',function(req, res){
    res.render('index');
    });

    app.get('/register',function(req, res){
        res.render('register');
    });

    app.get('/login',function(req, res){
        res.render('login');
    });

    app.get('/add',function(req, res){
        res.render('add');
    });

    app.get('/delete',function(req, res){
        res.render('delete');
    });

    app.get('/alter',function(req, res){
        res.render('alter');
    });

    app.get('/scan',function(req, res){
        res.render('scan');
    });
}