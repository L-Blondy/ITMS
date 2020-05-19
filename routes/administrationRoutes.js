const router = require('express').Router();
const chalk = require('chalk');
const fs = require('fs');
const AdministrationController = require('../controllers/AdministrationController');

const sendData = (req, res) => res.send({ administrationData: req.data });

router.get(
	'/:type/categories/',
	AdministrationController.getCategories,
	sendData
);
router.post(
	'/:type/categories/',
	AdministrationController.updateCategories,
	sendData
);

module.exports = router;