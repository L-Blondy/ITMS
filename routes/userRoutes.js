const router = require('express').Router();
const UserMW = require('../middlewares/UserMW');

const sendData = (req, res) => res.send(req.data);

router.get(
	'/',
	UserMW.filterUsers,
	sendData
);


router.get(
	'/new',
	UserMW.getNewId,
	sendData
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
	sendData
);

router.get(
	'/:id',
	UserMW.getUser,
	UserMW.getUserGroups,
	sendData
);

module.exports = router;