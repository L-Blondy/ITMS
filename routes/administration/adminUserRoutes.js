const router = require('express').Router();
const UserController = require('../../controllers/UserController');

router.get(
	'/new',
	UserController.getNewId,
	(req, res) => {
		res.send({ administrationData: req.data });
	}
);

router.post(
	'/new',
	(req, res, next) => {
		req.user = req.body;
		next();
	},
	UserController.hashPassword,
	UserController.assignRefreshToken,
	UserController.createNewUser,
	(req, res) => {
		res.send({ administrationData: req.data });
	}
);

module.exports = router;