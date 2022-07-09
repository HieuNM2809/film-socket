const express = require('express');
const { Server } = require("socket.io");
const app = express();
const http = require('http');
const server = http.createServer(app);
// const io = new Server(server);

var arrayUser = []; 
var arrayListUSerTyping = []; 

const io = require('socket.io')(server, {
    //path: '/socket/laravel/socket.io',
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
app.set('view engine', 'ejs');
io.on("connection", function (socket) {
    // ====================== THÔNG BÁO
    // chat message
    socket.on('client-send-alert', (title, content) => {
        console.log(title, content);

        socket.emit('server-send-alert', {'status': 1, 'title':'Thông báo' , 'content': 'Gửi thành công !!'});  
        socket.broadcast.emit('server-send-alert', {'status': 1, 'title':title , 'content': content});  
    });

    // ====================== NHẮN TIN
    socket.on('client-send-Username',(user)=>{
        if(arrayUser.indexOf(user) >= 0){
            // gửi thông báo đến người đăng ký thất bại
            socket.emit('server-send-dki-thatbai',{'status': 1, 'messge': 'Username đã được sử dụng'});
        }else{
            // gửi đăng ký thành công
            arrayUser.push(user);
            socket.userName = user;
            // thông báo cho người đăng ký thành công
            socket.emit('server-send-dki-thanhcong', {'status': 1, 'user': user });
            io.sockets.emit('server-send-danhsach-Users', {'status': 1, 'listUser':arrayUser});
            console.log(arrayUser);
        }
    });

    socket.on('client-send-messge', (msg)=>{
        console.log(msg);
        socket.emit('server-send-messge-to-me', {'status': 1, 'message':msg , 'user': socket.userName});
        socket.broadcast.emit('server-send-messge-broadcast', {'status': 1, 'message':msg, 'user': socket.userName});
    });

    socket.on('logout', ()=>{
        arrayUser.splice(
            arrayUser.indexOf(socket.userName),1
        );
        socket.broadcast.emit('server-send-danhsach-Users', {'status': 1, 'listUser':arrayUser});
    });

    socket.on('typing', function () {
        arrayListUSerTyping.push(socket.userName); 
        socket.broadcast.emit('server-send-typing', {'listUserTyping':arrayListUSerTyping});
    })
    socket.on('typing-close', function () {
        console.log(arrayListUSerTyping);
        arrayListUSerTyping.splice(
            arrayListUSerTyping.indexOf(socket.userName),1 
        );
        console.log(arrayListUSerTyping);
        socket.broadcast.emit('server-send-typing', {'listUserTyping':arrayListUSerTyping});
    })

    socket.on("disconnect",function () {
        arrayUser.splice(
            arrayUser.indexOf(socket.userName),1
        );
        socket.broadcast.emit('server-send-danhsach-Users', {'status': 1, 'listUser':arrayUser});
    });

})
app.get("/", function (req, res) {
    res.render("trangchu");
});

const port = process.env.PORT || 3000 ;
server.listen(port);