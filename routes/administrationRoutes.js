const router = require('express').Router();
const chalk = require('chalk');
const fs = require('fs');
const Administration = require('../controllers/AdministrationController');

const sendData = (req, res) => res.send({ administrationData: req.data });

router.get(
	'/:type/categories/',
	Administration.getCategories,
	sendData
);
router.post(
	'/:type/categories/',
	Administration.updateCategories,
	sendData
);

module.exports = router;