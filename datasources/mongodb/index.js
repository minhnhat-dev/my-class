const mongoose = require("mongoose");
const config = require("./config");
const models = require("./models");
const controllers = require("./controllers");
const utils = require("./utils");

let url = config.MONGO_LOCALHOST;

if (
    process.env.NODE_ENV === "development"
    || process.env.NODE_ENV === "production"
) {
    /* connect replica set */
    // url = `mongodb://${"mongo1"}:${config.MONGO_PORT},${"mongo2"}:${config.MONGO_PORT},${"mongo3"}:${config.MONGO_PORT}/${config.MONGO_DB_NAME}?replicaSet=rs0&authSource=admin`;
    url = `mongodb://${config.MONGO_USER}:${config.MONGO_PASSWORD}@${config.MONGO_IP}:${config.MONGO_PORT}/${config.MONGO_DB_NAME}?authSource=admin`;
}
console.log("url", url);
mongoose.connect(url, config.MONGO_OPTIONS, (err) => {
    if (err) {
        console.log("Connect to database fail!");
    } else {
        console.log("Connect database Success!");
    }
});

/* When connect successfully  */
mongoose.connection.on("connected", () => {
    // console.info(`Mongoose default connection open to ${URI_MONGO}`);
});

/* If connect throw error */
mongoose.connection.on("error", (err) => {
    console.info(`Mongoose default connection error: ${err}`);
});

// When the connection is disconnected
mongoose.connection.on("disconnected", () => {
    console.info("Mongoose default connection disconnected");
});

mongoose.set("debug", (collectionName, method, query, doc) => {
    // console.log(`gateway ${collectionName}.${method}`, JSON.stringify(query), doc);
});

// If the Node process ends, close the Mongoose connection
process.on("SIGINT", () => {
    mongoose.connection.close(() => {
        console.info(
            "Mongoose default connection disconnected through app termination"
        );
        throw new Error(
            "Mongoose default connection disconnected through app termination"
        );
    });
});

module.exports = {
    models,
    controllers,
    utils
};
