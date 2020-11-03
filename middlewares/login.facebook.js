
const createError = require('http-errors');
const AccessToken = require('../models/access-token.model');
const Role = require('../models/roles.model');
const User = require('../models/users.model');
const { createAccessToken } = require('../middlewares/authention');
const Strategy = require('passport-facebook').Strategy;
const UserBusiness = require('../business/users.business');
const {
  JWT_SECRET,
  accessTokenData,
  roles,
  ngrok,
  REALM,
} = require('../configs');
const jwt = require('jsonwebtoken');


function loginFacebook(passport) {
  try {
    // authentication.
    passport.use(new Strategy({
      clientID: '560869681324758',
      clientSecret: '379f3ad07e8734868ce74c0e5e682d30',
      callbackURL: `${ngrok}/auth/facebook`,
    },
    ((accessToken, refreshToken, profile, cb) => {
      // In this example, the user's Facebook profile is supplied as the user
      // record.  In a production-quality application, the Facebook profile should
      // be associated with a user record in the application's database, which
      // allows for account linking and authentication with other identity
      // providers.

      /* Create user */
      const userBusiness = new UserBusiness();
      const { id, displayName } = profile;
      const data = {
        displayName,
        facebookId: id,
        email: `${id}@localhost.com`,
        realm: REALM.student,
        accessToken,
      };
      userBusiness.create(data).then(() => cb(null, { accessToken, refreshToken, profile })).catch((error) => { throw error; });
    })));
  } catch (error) {
	  throw error;
  }
}

module.exports = {
  loginFacebook,
};
