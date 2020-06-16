const router = require('express').Router();
const UserController = require('../controllers/UserController');

const hashPassword = genRefreshToken = createNewUser = (req, res, next) => next();

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