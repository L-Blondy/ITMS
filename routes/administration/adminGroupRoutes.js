const router = require('express').Router();
const GroupMW = require('../../middlewares/GroupMW');

const setData = (req, res, next) => {
	req.data = {};
	next();
};
router.use(setData);
const sendData = (req, res) => res.send({ administrationData: req.data });

router.get(
	'/',
	GroupMW.getAll,
	sendData
);

router.get(
	'/new',
	sendData
);

router.post(
	'/new',
	GroupMW.createGroup,
	sendData
);

router.get(
	'/:name',
	GroupMW.getSingle,
	sendData
);
module.exports = router;