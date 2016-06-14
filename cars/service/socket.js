var student=require('../controllers').Student;
var config=require('../config');
function socketProcess(socket,io) {
	
	console.log("connect is istablish");
	//提交排队信息,取号
	socket.on('getNumber',function(){
		//查询学生是否已经提交过并且处于等待状态
		console.log("getNumber"+'取号！！！');
		if(!socket.request.session.user.userid){
			socket.emit('err',"取号失败，您无法取号！！！");
		}
		student.findStudentBySno(socket.request.session.user.userid,function(err,user){
			if(user){
				console.log("取号失败"+user);
				socket.emit('err',"您之前已经取号！！！");
			} else { //插入到数据库，并通知客户端
				student.insertNewStudent(socket.request.session.user,function(err,user){
					if(err) socket.emit('err',"取号失败，再试一次！");
					else {
						socket.emit('suc',"取号成功，请耐心等待！");
						//向所有的客户端发送刚进入队列的学生信息
						console.log("向所有"+user);
						io.sockets.emit('studentAdded',user);	
					}
				});
			}
		});
	});
	socket.on('getMe',function(){
		socket.emit('getMe',socket.request.session.user);
	});
	//修改当前正在处理的排队信息
	socket.on('finishElement',function(_sno){
		//修改当前的确认完成的学生状态，修改为已处理
		student.setPassed(_sno,function(err,stu){
			if(err){
				io.sockets.emit('err',"抱歉，系统内部错误！");//失败
			} else{//向所有的客户端发送下一个待处理的用户
				io.sockets.emit('studentNext',stu);//处理下一个
				socket.emit('suc','操作成功！！');
			}
		});
		//根据正在处理的id
	});
	//把所有排队信息发送到前端
	socket.on('getStudents',function(){
		student.getQueueStudents(function(err,students){
			socket.emit('allStudents',students);//把数据发往前端
		});
	});
	//管理员登录
	socket.on('adminLogin',function(password){
		if(password===config.adminPass){
			socket.emit('adminLoginSuc',"登录成功！！！");//把数据发往前端
		} else {
			socket.emit('err',"登录失败！！！");//把数据发往前端
		}
	});
}

exports.socketProcess=socketProcess;