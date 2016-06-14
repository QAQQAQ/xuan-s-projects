/**
 * Created by lenovo on 2016/5/31.
 */
var express = require('express');
var path = require('path');

var app = express();

app.set('views',path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

require('./init/routes')(app);

//app.get('/',function(req, res){
//    res.render('index');
//});

app.listen(4000, function (req, res) {
    console.log('app is running at port 4000');
});