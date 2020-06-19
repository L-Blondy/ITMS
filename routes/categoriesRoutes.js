const router = require('express').Router();
const CategoriesMW = require('../middlewares/CategoriesMW');

const sendData = (req, res) => res.send({ categoriesData: req.data });

router.get(
	'/:type',
	CategoriesMW.getCategories,
	sendData
);
router.post(
	'/:type',
	CategoriesMW.updateCategories,
	sendData
);

module.exports = router;