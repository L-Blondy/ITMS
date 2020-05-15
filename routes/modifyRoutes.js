const router = require('express').Router();
const chalk = require('chalk');
const fs = require('fs');
const Modification = require('../controllers/ModificationController');

router.get(
	'/:type/categories/',
	Modification.getCategories,
	(req, res) => {
		res.send(req.data);
	}
);
router.post(
	'/:type/categories/',
	Modification.updateCategories,
	(req, res) => {
		res.send(req.data);
	}
);

module.exports = router;