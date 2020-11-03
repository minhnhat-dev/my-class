
// const createError = require('http-errors');
// const AccessToken = require('../models/access-token.model');
// const Role = require('../models/roles.model');
// const User = require('../models/users.model');
// const { createAccessToken } = require('../middlewares/authention');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const UserBusiness = require('../business/users.business');
// const {
//   JWT_SECRET,
//   accessTokenData,
//   roles,
//   ngrok,
//   REALM,
// } = require('../configs');
// const jwt = require('jsonwebtoken');


// function loginGoogle(passport) {
//   try {
//     // authentication.
//     passport.use(new GoogleStrategy({
//       clientID: '92410094025-iv9n8vch1s7f51vho5r70sani7v70p64.apps.googleusercontent.com',
//       clientSecret: '4VaHy6fT4ZNgSkMd3hGuF_QY',
//       callbackURL: `${ngrok}/auth/google`,
//     },
//     ((accessToken, refreshToken, profile, cb) => {
//       /* Create user */
//       const userBusiness = new UserBusiness();
//       const { _json, id, displayName } = profile;
//       const { email } = _json;
//       const data = {
//         displayName,
//         googleId: id,
//         email: email || `${id}@localhost.com`,
//         realm: REALM.student,
//         accessToken,
//       };
//       userBusiness.create(data).then(() => cb(null, { accessToken, refreshToken, profile })).catch((error) => { throw error; });
//     })));
//   } catch (error) {
// 	  throw error;
//   }
// }

// module.exports = {
//   loginGoogle,
// };
