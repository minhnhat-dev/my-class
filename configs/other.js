module.exports = {
    hostName: process.env.HOST || 'localhost',
    port: process.env.PORT || '3000',
    socketioPort: parseInt(process.env.SOCKET_IO_PORT || '3001', 10)
};
