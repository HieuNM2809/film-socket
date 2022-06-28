var express = require('express');
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views","./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);

io.on("connection" ,function (socket) {
    console.log("co ng truy cap: " + socket.id);
    socket.on("disconnect",function () {
        console.log(socket.id + " ngat ket noi");
    });
})
app.get("/", function (req, res) {
    res.render("trangchu");    
});


server.listen(3000);