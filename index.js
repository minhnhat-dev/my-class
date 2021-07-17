const app = require("./app");
const configs = require("./configs");
const { startSocketioServer } = require("./socketio");

const { APPID } = process.env;

const server = app.listen(configs.port, () => {
    console.log(`🚀 Running on port ${configs.port} APPID: {${APPID}}`);
});

// startSocketioServer(server);
process.on("uncaughtException", (exception) => {
    console.error(exception);
});

process.on("unhandledRejection", (reason) => {
    console.error(reason.stack || reason);
});

process.on("SIGINT", () => {
    console.error("Got SIGINT (aka ctrl-c in docker). Graceful shutdown");
    shutdown();
});

process.on("SIGTERM", () => {
    console.error("Got SIGTERM (docker container stop). Graceful shutdown");
    shutdown();
});

function shutdown() {
    server.close((err) => {
        if (err) {
            console.error("SHUTDOWN ERROR", err);
            process.exitCode = 1;
        }
        process.exit();
    });
}
