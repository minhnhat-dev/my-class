
const mongoose = require('../db-helpers/mongoose-init');
// mongoose.connect();
const Roles = require('../models/roles.model');
const { roles } = require('../configs');

async function init() {
  try {
    return initRoles();
  } catch (error) {
    throw error;
  }
}

async function initRoles() {
  try {
    /* init role and roleMapping */
    const promise = [];
    roles.map((role) => {
      promise.push(
        Roles.findOneOrCreate({ name: role }, { name: role }),
      );
    });
    return Promise.all(promise);
  } catch (error) {
    throw error;
  }
}
init().then().catch((error) => {
  throw error;
});
module.exports = {
  init,
};
