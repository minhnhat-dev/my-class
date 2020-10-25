
const mongoose = require('mongoose');

module.exports.connect = function () {
  mongoose.connect('mongodb://mongo:27017/my-class', { useNewUrlParser: true })
    .then(() => {
      console.log('Connect success database !');
    }).catch((err) => {
      console.log('Connect fail ');
      console.log('Error: ', err);
    });
};

module.exports.disconnect = function () {
  return mongoose.disconnect();
};
