// 引入net模块
const net = require("net");

//表示当前的在线人数
var count = 0;

//存储当前聊天室的用户
var user = {};

//创建服务器
var server = net.createServer(function(scoket){
    
	scoket.write("Welcome to this chat,now " + count + " people at this time…… \r\nYour name is：");

	//聊天室的人数要进行增加
	count ++;
	
	//临时存储用户输入的姓名
	var nickname;

	//公共的广播方法
	function broadcast(msg){
		for(var i in user){
			if(i != nickname){
				user[i].write(msg);
			}
		}
	};

	var temp = "";

	scoket.on("data",function(data){
		temp += data;

		if(temp.indexOf("\n") === -1){
			return;
		}

		data = temp.replace(/\r|\n/g,"");
		
		//用户名重复存在的时候
		if(!nickname){
			if(user[data]){
				scoket.write("nockname already in use,try again \r\n");

				temp = "";

				return;
			} else{
				nickname = data;
				user[nickname] = scoket;

				broadcast(nickname + " - join the room \n");
			}
		} else{
			broadcast(nickname + " Say：" + data + "\r\n");
		}

		temp = "";
	});

	//用户离开的时候
	scoket.on("close",function(){
		count --;
		delete user[nickname];

		broadcast(nickname + "Leave the room!");
	});

});

//监听端口
server.listen(9000,function(){
	console.log("server listening on 9000");
});

/********************************************
访问：在另一个窗口中输入telnet 127.0.0.1 9000
********************************************/
