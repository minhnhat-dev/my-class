const app = require('./app');
const configs = require('./configs');

const server = app.listen(configs.port, '0.0.0.0', () => {
    console.log(`🚀 Running on port ${configs.port}`);
});

process.on('uncaughtException', (exception) => {
    console.error(exception);
});

process.on('unhandledRejection', (reason) => {
    console.error(reason.stack || reason);
});

process.on('SIGINT', () => {
    console.error('Got SIGINT (aka ctrl-c in docker). Graceful shutdown');
    shutdown();
});

process.on('SIGTERM', () => {
    console.error('Got SIGTERM (docker container stop). Graceful shutdown');
    shutdown();
});

function shutdown() {
    server.close((err) => {
        if (err) {
            logger.error('SHUTDOWN ERROR', err);
            process.exitCode = 1;
        }
        process.exit();
    });
}
