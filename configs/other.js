module.exports = {
    hostName: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || '3000',
    socketioPort: parseInt(process.env.SOCKET_IO_PORT || '3001', 10)
};
