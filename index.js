const express = require('express');
const { Server } = require("socket.io");
const app = express();
const http = require('http');
const server = http.createServer(app);
// const io = new Server(server);

const io = require('socket.io')(server, {
    //path: '/socket/laravel/socket.io',
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on("connection", function (socket) {
    // chat message
    socket.on('client-send-alert', (title, content) => {
        console.log(title, content);

        socket.emit('server-send-alert', {'status': 1, 'title':'Thông báo' , 'content': 'Gửi thành công !!'});  
        socket.broadcast.emit('server-send-alert', {'status': 1, 'title':title , 'content': content});  
    });

})
app.get("/", function (req, res) {
    res.render("trangchu");
});


server.listen(3000);