const CreateError = require("http-errors");

let users = [];

const addUser = (input) => {
    const { userId, socketId } = input;
    if (!userId || !socketId) throw new CreateError.BadRequest("error_userId_required");

    const existingUser = users.find((user) => user.userId === userId);

    if (!existingUser) {
        const user = { userId, socketId };
        users.push(user);
    }

    return users;
};

const removeUser = (socketId) => {
    const newUser = users.filter((item) => item.socketId !== socketId);
    users = newUser;
    return true;
};

const getUser = (userId) => users.find((user) => user.userId === userId);
const getUsers = () => users;

const getUsersInRoom = (roomName) => users.filter((user) => user.roomName === roomName);
const getUsersOnline = () => users;

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    getUsersOnline,
    getUsers
};
