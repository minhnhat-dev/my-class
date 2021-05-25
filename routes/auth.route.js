const express = require('express');

const router = express.Router();
const { verifySession } = require('../middlewares/authentication');
const { validateBody, validateQuery } = require('../validators');
const { usersControllers } = require('../controllers');
const { usersSchema } = require('../schemas');
require('express-async-errors');

// router.use(verifyToken);

router.post('/register', validateBody(usersSchema.create), usersControllers.createUser);
router.get('/', verifySession, validateQuery(usersSchema.getList), usersControllers.getUsers);
router.post('/login', validateBody(usersSchema.login), usersControllers.login);

module.exports = router;
/* login with facebook */
// app.get('/login/facebook', passport.authenticate('facebook'));
// /* login with google */
// app.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email', 'openid'] }));

// app.get(
//     '/auth/facebook',
//     passport.authenticate('facebook', { failureRedirect: '/login' }),
//     (req, res) => {
//         const { user } = req;
//         res.send(user);
//     }
// );

// /* callback login with facebook */
// app.get(
//     '/auth/google',
//     passport.authenticate('google', { failureRedirect: '/login' }),
//     (req, res) => {
//         res.redirect('/');
//     }
// );
