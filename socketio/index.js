const http = require("http");
const socketServer = require("socket.io");
const config = require("../configs/other");
const {
    addUser,
    getUsersInRoom,
    getUser,
    getUsersOnline,
    removeUser
} = require("../services/socket-io.service");

const PORT_SOCKET = process.env.PORT_SOCKET || 3001;

const server = http.createServer((req, res) => {
    if (req.url === "/healthcheck" && req.method === "GET") {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ isSuccess: true }));
    }
});

const devicesConfigs = [
    {
        deviceId: "deviceA",
        display: "displayA"
    },
    {
        deviceId: "deviceB",
        display: "displayB"
    },
    {
        deviceId: "deviceC",
        display: "displayC"
    }
];
// 8900
const io = socketServer(server, {
    cors: {
        origin: "*", // url connect
        allowedHeaders: ["Authorization"]
    }
});
global.io = io;

// function authenticate(socket, next) {
//     const { token } = socket.request.query;
//     console.log("socket token: ", token);
//     next();
// }

// io.use(authenticate);

io.on("connection", (socket) => {
    logger.info(`+ ${socket.id} is connnect....`);
    io.emit("welcome", "Welcome my connection");
    const { deviceId, displayId } = socket.handshake.query;

    if (!deviceId) {
        return {
            error: [
                "error_device_id_required"
            ]
        };
    }
    console.log("socket.rooms 1", socket.rooms);
    socket.join(deviceId);
    console.log("socket.rooms 2", socket.rooms);
    const socketId = socket.id;
    logger.info("+ addDevice() socketId: ==>", socketId);
    logger.info("+ addDevice() deviceId: ==>", deviceId);
    const input = { deviceId, socketId };
    addDevice(input);
    const devices = getDevices();
    logger.info("+ addDevice() devices: ==>", devices);

    socket.on("sendMessage", ({ deviceId, data }) => {
        io.to(deviceId).emit("getMessage", {
            deviceId,
            data
        });
    });

    socket.on("disconnect", () => {
        socket.leave(deviceId);
        console.log("disconnect socket.rooms 2", socket.rooms);
        logger.info(`+ ${socket.id} is disconnect....`);
    });
});

function startSocketioServer() {
    server.listen(PORT_SOCKET);
    console.log(`+ startSocketioServer() Socket.io Server running on port: ${PORT_SOCKET}`);
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
