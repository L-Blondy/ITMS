const router = require('express').Router();
const UserMW = require('../../middlewares/UserMW');

router.get(
	'/new',
	UserMW.getNewId,
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
	UserMW.hashPassword,
	UserMW.assignRefreshToken,
	UserMW.createNewUser,
	(req, res) => {
		res.send({ administrationData: req.data });
	}
);

router.get(
	'/:id',
	UserMW.getUser,
	UserMW.getUserGroups,
	(req, res) => {
		res.send({ administrationData: req.data });
	}
);

module.exports = router;