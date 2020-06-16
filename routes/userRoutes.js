const router = require('express').Router();
const UserController = require('../controllers/UserController');

router.get(
	'/it/administration/user/new',
	UserController.getNewId,
	(req, res) => {
		res.send({ administrationData: req.data });
	}
);

router.post(
	'/it/administration/user/new',
	UserController.hashPassword,
	UserController.createNewUser,
	(req, res) => {
		res.send({ administrationData: req.data });
	}
);

module.exports = router;