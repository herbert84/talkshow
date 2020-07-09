var express = require('express');
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

const ClientManager = require('./server/ClientManager')
const ChatroomManager = require('./server/ChatroomManager')
const makeHandlers = require('./server/handlers')

const clientManager = ClientManager()
const chatroomManager = ChatroomManager()

var users = [];

const port = process.env.PORT || 3000;
if (process.env.PORT)
    app.use('/', express.static(__dirname + '/public/'));
server.listen(port);

io.sockets.on('connection', (socket) => {
    const {
        handleRegister,
        handleJoin,
        handleLeave,
        handleMessage,
        handleGetChatrooms,
        handleGetAvailableUsers,
        handleDisconnect
    } = makeHandlers(socket, clientManager, chatroomManager)
    console.log('client connected...', socket.id)

    clientManager.addClient(socket)

    socket.on('register', handleRegister)

    socket.on('availableUsers', handleGetAvailableUsers)

    socket.on('chatrooms', handleGetChatrooms)

    socket.on('join', handleJoin)

    socket.on('leave', handleLeave)

    socket.on('message', handleMessage)

    // 失去连接
    /*socket.on('disconnect', function () {
       if (users.indexOf(socket.username) > -1) {
            users.splice(users.indexOf(socket.username), 1);
            console.log(socket.username + '===>disconnected');
        }

        socket.broadcast.emit('users', { number: users.length });
    });
    socket.on('disconnect', function () {
        console.log('client disconnect...', socket.id)
        handleDisconnect()
    })

    socket.on('message', function (data) {
        let newData = { text: data.text, user: socket.username }
        socket.emit('receive_message', newData);
        socket.broadcast.emit('receive_message', newData);
    });


    socket.on('login', function (data) {
        if (users.indexOf(data.username) > -1) {

        } else {
            socket.username = data.username;
            users.push(data.username);
            // 统计连接数
            socket.emit('users', { number: users.length });  // 发送给自己
            socket.broadcast.emit('users', { number: users.length }); // 发送给其他人
        }
    });*/
    socket.on('disconnect', function () {
        console.log('client disconnect...', socket.id)
        handleDisconnect()
    })
    socket.on('error', function (err) {
        console.log('received error from client:', socket.id)
        console.log(err)
    })

});


console.log('服务器运行于：localhost:8088');