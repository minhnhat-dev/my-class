const socketServer = require("socket.io");
const redis = require("redis");
const redisAdapter = require("socket.io-redis");

const { handleChatSocketIO } = require("./chat.socketio");

function startSocketioServer(server) {
    const io = socketServer(server, {
        path: "/v1/socketio",
        allowEIO3: true,
        cors: {
            origin: "*", // url connect
            allowedHeaders: ["Authorization"]
        }
    });

    const pubClient = redis.createClient({ host: "localhost", port: 6379 });
    const subClient = pubClient.duplicate();
    io.adapter(redisAdapter({ pubClient, subClient }));
    handleChatSocketIO(io);
    global.io = io;
    console.log("+ startSocketioServer() Socket.io Server running...");
}

function stopSocketioServer() {
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
    stopSocketioServer
};
