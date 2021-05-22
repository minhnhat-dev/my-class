const users = [];
console.log('users', users);
const addUser = (input) => {
    const { id, roomName = '', userName = '' } = input;
    if (!roomName || !userName) return { error: 'Username and RoomName are required.' };

    const existingUser = users.find((user) => user.roomName === roomName.trim() && user.name === userName.trim());

    if (existingUser) return { error: 'Username is taken.' };

    const user = {
        id,
        roomName,
        userName
    };
    users.push(user);
    return { user };
};

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) return users.splice(index, 1)[0];
    return true;
};

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (roomName) => users.filter((user) => user.roomName === roomName);

module.exports = { addUser, removeUser, getUser, getUsersInRoom };
