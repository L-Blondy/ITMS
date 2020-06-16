const router = require('express').Router();
const CategoriesController = require('../controllers/CategoriesController');

const sendData = (req, res) => res.send({ administrationData: req.data });

router.get(
	'/:type',
	CategoriesController.getCategories,
	sendData
);
router.post(
	'/:type',
	CategoriesController.updateCategories,
	sendData
);

module.exports = router;