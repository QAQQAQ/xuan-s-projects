///**
// * Created by lenovo on 2016/5/6.
// */
////var mysql = require('mysql');
////var connection = mysql.createConnection({
////    host: 'localhost',
////    user: 'mynode',
////    password: '123456',
////    database: 'mynode'
////});
//
////connection.connect(function (err) {
////    if (err) throw err;
////    connection.query('SELECT * FROM user', function (err, ret) {
////        if (err) throw err;
////        console.log(ret);
////        connection.end();
////    });
////});
//var mysql = require('mysql');
//
//var connection = mysql.createConnection({
//    host: 'localhost',
//    user: 'mynode',
//    password: '123456',
//    database: 'mynode'
//});
//
//connection.connect(function (err) {
//    if (err) throw err;
//
//    //var value = 'zhang" OR "1"="1';
//    var value = 'jia';
//    //var query =  connection.query('SELECT * FROM user where name="'+value+'"', function (err, ret) {
//        var query =  connection.query('SELECT * FROM user where name=?',value,function (err, ret) {
//        if (err) throw err;
//
//        console.log(ret);
//        connection.end();
//    });
//
//    console.log(query.sql);
//});
var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'mynode',
    password: '123456',
    database: 'mynode'
});

pool.getConnection(function (err, connection) {
    if (err) throw err;
    var value = 'zhang';
    var query = connection.query('SELECT * FROM user WHERE name=?', value, function (err, ret) {
        if (err) throw err;

        console.log(ret);
       connection.release();
    });
    console.log(query.sql);
});