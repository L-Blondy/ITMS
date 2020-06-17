const chalk = require('chalk');
const router = require('express').Router();
const UserMW = require('../middlewares/UserMW');

router.post(
	'/login',
	UserMW.validateLogin,
	UserMW.assignAccessToken,
	(req, res) => {
		res.send({ user: req.user });
	}
);

module.exports = router;