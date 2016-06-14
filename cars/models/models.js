var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: String,
    password: String,
    passwordRepeat: String,
    email:String,
    createTime: {
        type: Date,
        default: Date.now
    }
});


/*create table user(
 username VARCHAR(100) NOT NULL,
 password VARCHAR(100) NOT NULL,
 passwordRepeat VARCHAR(100) NOT NULL,
 createTime DATE,
 PRIMARY KEY ( username )
 );*/

var noteSchema = new Schema({
    title: String,
    author: String,
    tag: String,
    content: String,
    createTime: {
        type: Date,
        default: Date.now
    }
});
/*create table note(
 title VARCHAR(100) NOT NULL,
 author VARCHAR(100) NOT NULL,
 tag VARCHAR(100) NOT NULL,
 content TEXT NOT NULL,
 createTime DATE,
 PRIMARY KEY ( title, author )
 );*/
exports.Note = mongoose.model('Note',noteSchema);
exports.User = mongoose.model('User',userSchema);