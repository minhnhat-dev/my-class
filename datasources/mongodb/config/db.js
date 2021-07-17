module.exports = {
    MONGO_DB_NAME: process.env.MONGO_DB_NAME || "social-network",
    MONGO_IP: process.env.MONGO_IP || "mongodb",
    MONGO_PORT: process.env.MONGO_PORT || "27017",
    MONGO_USER: process.env.MONGO_USER || "nhatnguyen",
    MONGO_PASSWORD: process.env.MONGO_PASSWORD || "mypassword",
    MONGO_LOCALHOST: "mongodb://localhost:27017/social-network",
    REDIS_URL: process.env.REDIS_URL || "redis",
    MONGO_OPTIONS: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
        // replicaSet: "rs0"
    }
};
