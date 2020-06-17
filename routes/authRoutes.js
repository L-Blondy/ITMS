const chalk = require('chalk');
const router = require('express').Router();
const UserController = require('../controllers/UserController');

router.post(
	'/login',
	UserController.validateLogin,
	UserController.assignAccessToken,
	(req, res) => {
		res.send({ user: req.user });
	}
);

module.exports = router;