const mongoose = require('mongoose');
const config = require('./config');
const models = require('./models');
const controllers = require('./controllers');
const utils = require('./utils');

// expect return connect
if (process.env.NODE_ENV === 'test') {
  mongoose.connect(config.databaseTest, config.mongoOptions, (err) => {
    if (err) {
      console.log('Connect to database fail!');
    } else {
      console.log('Connect database Success!');
    }
  });

  /* When connect successfully  */
  mongoose.connection.on('connected', () => {
    // console.info(`Mongoose default connection open to ${URI_MONGO}`);
  });

  /* If connect throw error */
  mongoose.connection.on('error', (err) => {
    console.info(`Mongoose default connection error: ${err}`);
  });

  // When the connection is disconnected
  mongoose.connection.on('disconnected', () => {
    console.info('Mongoose default connection disconnected');
  });

  mongoose.set('debug', (collectionName, method, query, doc) => {
    // console.log(`gateway ${collectionName}.${method}`, JSON.stringify(query), doc);
  });

  // If the Node process ends, close the Mongoose connection
  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.info(
        'Mongoose default connection disconnected through app termination',
      );
      throw new Error(
        'Mongoose default connection disconnected through app termination',
      );
    });
  });
}

module.exports = {
  models,
  controllers,
  utils,
};
