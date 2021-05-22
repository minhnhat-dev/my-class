module.exports = {
    MONGO_DB_NAME: process.env.MONGO_DB_NAME || 'my-app',
    MONGO_IP: process.env.MONGO_IP || 'mongodb',
    MONGO_PORT: process.env.MONGO_PORT || '27017',
    MONGO_USER: process.env.MONGO_USER,
    MONGO_PASSWORD: process.env.MONGO_PASSWORD,
    MONGO_LOCALHOST: 'mongodb://localhost:27017/my-app',
    MONGO_OPTIONS: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }
    // redis config
};
