var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

io.on("connect", function (socket) {
	var _channel;
	socket.on("message", function (data) {
		io.to(_channel).emit("message", data);
	});
	socket.on("join", function (channel) {
		_channel = channel;
		socket.join(channel);
	});
});

app.use(express.static("client"));

var messages = [
	{date: new Date(), nickname: "Ana", message: "Oi, tudo bem?"},
	{date: new Date(), nickname: "Maria", message: "Quer sair comigo?"},
	{date: new Date(), nickname: "Carol", message: "Mãe solteira, procura..."}
];

app.get("/messages", function (req, res) {
	res.json(messages);
});

app.post("/messages", function (req, res) {
	var message = req.body;
	messages.push(message);
	res.json(message);
});

server.listen(process.env.PORT || 3000);