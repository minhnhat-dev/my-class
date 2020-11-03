module.exports = {
  databaseTest: process.env.DATABASE_TEST || 'mongodb://localhost/my_class_test',
  database: process.env.MONGO_DATABASE_STRING || 'mongodb://localhost/my_class',
  mongoOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  // redis config
};
