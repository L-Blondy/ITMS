require('dotenv').config();
const fs = require('fs');
const Category = require('../models/administration/Category');

module.exports = {

	getCategories: async function (req, res, next) {
		const { type } = req.params;
		try {
			const filePath = Category.getFilePath(type);
			const data = await Category.getData(filePath);
			req.data = data;
			next();
		}
		catch (err) {
			res.status(404).send('Not found');
		}
	},

	updateCategories: async function (req, res, next) {
		const { type } = req.params;
		try {
			const data = req.body;
			const filePath = Category.getFilePath(type);
			req.data = await Category.updateFile(filePath, data);
			next();
		}
		catch (err) {
			res.status(404).send('Not found');
		}
	},

};