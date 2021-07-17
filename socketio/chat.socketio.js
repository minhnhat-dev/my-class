const {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    getUsersOnline,
    getUsers
} = require("../services/user-socketio.service");

function handleChatSocketIO(io) {
    const chatNamespace = io.of("/v1/socketio/chat");

    chatNamespace.on("connection", (socket) => {
        console.log(`+ ${socket.id} is connnect....`);
        io.emit("welcome", "Welcome my connection");
        const socketId = socket.id;
        const { userId } = socket.handshake.query;

        if (!userId) {
            chatNamespace.to(socketId).emit("error", { error: "User Id is required !" });
            return;
        }

        socket.join(userId);
        /* check rooms */
        const { rooms } = chatNamespace.adapter;
        const { sids } = chatNamespace.adapter;
        console.log("rooms", rooms);
        console.log("sids", sids);

        const input = { userId, socketId };
        addUser(input);
        const users = getUsers();
        console.log("+ connection() users", users);

        socket.on("sendMessage", (data) => {
            console.log("data", data);
            console.log("userId", userId);
            chatNamespace.to(userId).emit("getMessage", data);
        });

        socket.on("disconnect", () => {
            socket.leave(userId);
            console.log(`+ ${socket.id} is disconnect....`);
            console.log(`+ ${userId} is disconnect....`);
        });
    });
}

module.exports = {
    handleChatSocketIO
};
