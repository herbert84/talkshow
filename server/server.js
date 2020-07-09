const express = require('express');
const app = express();

const server = require('http').createServer()
const io = require('socket.io')(server)

const ClientManager = require('./ClientManager')
const ChatroomManager = require('./ChatroomManager')
const makeHandlers = require('./handlers')

const clientManager = ClientManager()
const chatroomManager = ChatroomManager()

//app.use(express.static('public'));
//app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    //res.sendFile(path.join(__dirname, 'public', 'index.html'));
    res.sendFile('./public/index.html');
    //res.send('Hello World!');
});

io.on('connection', function (client) {
    const {
        handleRegister,
        handleJoin,
        handleLeave,
        handleMessage,
        handleGetChatrooms,
        handleGetAvailableUsers,
        handleDisconnect
    } = makeHandlers(client, clientManager, chatroomManager)

    console.log('client connected...', client.id)
    clientManager.addClient(client)

    client.on('register', handleRegister)

    client.on('join', handleJoin)

    client.on('leave', handleLeave)

    client.on('message', handleMessage)

    client.on('chatrooms', handleGetChatrooms)

    client.on('availableUsers', handleGetAvailableUsers)

    client.on('disconnect', function () {
        console.log('client disconnect...', client.id)
        handleDisconnect()
    })

    client.on('error', function (err) {
        console.log('received error from client:', client.id)
        console.log(err)
    })
})

const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('myapp listening on port ' + port);
});

/*server.listen(port, function (err) {
    if (err) throw err
    console.log('listening on port 8080')
})
*/