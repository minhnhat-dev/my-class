const http = require('http');
const socketServer = require('socket.io');
const config = require('../configs/other');
const { addUser, getUsersInRoom, getUser } = require('../services/socket-io.service');

const server = http.createServer((req, res) => {
    if (req.url === '/healthcheck' && req.method === 'GET') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ isSuccess: true }));
    }
});

const io = socketServer(server, {
    cors: {
        origin: '*'
    }
});
global.io = io;

const USER_JOIN_CHAT_EVENT = 'USER_JOIN_CHAT_EVENT';
const USER_LEAVE_CHAT_EVENT = 'USER_LEAVE_CHAT_EVENT';
const NEW_CHAT_MESSAGE_EVENT = 'NEW_CHAT_MESSAGE_EVENT';
const START_TYPING_MESSAGE_EVENT = 'START_TYPING_MESSAGE_EVENT';
const STOP_TYPING_MESSAGE_EVENT = 'STOP_TYPING_MESSAGE_EVENT';
let broadcaster;
io.on('connection', (socket) => {
    socket.on('join', (data, callback) => {
        const { roomName, userName } = data;
        const input = {
            id: socket.id,
            roomName,
            userName
        };
        const { error, user } = addUser(input);

        if (error) return callback(error);

        socket.join(user.roomName);
        socket.emit('message', { user: 'admin', text: `${user.userName}, welcome to room ${user.roomName}.` });
        socket.broadcast.to(user.roomName).emit('message', { user: 'admin', text: `${user.userName} has joined!` });

        io.to(user.roomName).emit('roomData', { roomName: user.roomName, users: getUsersInRoom(user.roomName) });

        return callback();
    });

    socket.on('join-room', (roomId, userId) => {
        console.log('roomId', roomId);
        console.log('userId', userId);
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId);
    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.roomName).emit('message', { user: user.roomName, text: message });

        callback();
    });

    /* handle broadcaster  */
    socket.on('broadcaster', () => {
        broadcaster = socket.id;
        socket.broadcast.emit('broadcaster');
    });
    socket.on('watcher', () => {
        socket.to(broadcaster).emit('watcher', socket.id);
    });

    socket.on('offer', (id, message) => {
        socket.to(id).emit('offer', socket.id, message);
    });
    socket.on('answer', (id, message) => {
        socket.to(id).emit('answer', socket.id, message);
    });
    socket.on('candidate', (id, message) => {
        socket.to(id).emit('candidate', socket.id, message);
    });
    // Leave the room if the user closes the socket
    socket.on('disconnect', () => {
        console.log('disconnect');
    });
});

function startSocketioServer() {
    server.listen(config.socketioPort);
    console.log(`socket.io server running on port: ${config.socketioPort}`);
}

function stopSocketioserver() {
    return new Promise((resolve, reject) => {
        io.close((error) => {
            if (error) {
                reject(error);
            }
            resolve();
        });
    });
}

module.exports = {
    startSocketioServer,
    stopSocketioserver
};
