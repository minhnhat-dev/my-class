const CreateError = require("http-errors");

let users = [];
console.log("users", users);

const addUser = (input) => {
    const { userId, socketId } = input;
    if (!userId || !socketId) throw new CreateError.BadRequest("error_userId_required");

    const existingUser = users.find((user) => user.userId === userId);

    if (existingUser) return { error: "Username is taken." };

    const user = { userId, socketId };
    users.push(user);
    console.log("users", users);
    return user;
};

const removeUser = (socketId) => {
    const newUser = users.filter((item) => item.socketId !== socketId);
    users = newUser;
    console.log("newUser", newUser);
    return true;
};

const getUser = (userId) => users.find((user) => user.userId === userId);

const getUsersInRoom = (roomName) => users.filter((user) => user.roomName === roomName);
const getUsersOnline = () => users;
module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    getUsersOnline
};
