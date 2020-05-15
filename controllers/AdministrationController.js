require('dotenv').config();
const path = require('path');
const fs = require('fs');
const Category = require('../models/Category');

module.exports = {

	getCategories: async function (req, res, next) {
		const { type } = req.params;
		const filePath = Category.getFilePath(type);
		const data = await fs.promises.readFile(path.join(__dirname, filePath), 'utf8');
		req.data = JSON.parse(data);
		next();
	},

	updateCategories: async function (req, res, next) {
		const { type } = req.params;
		const data = req.body;
		const filePath = Category.getFilePath(type);
		await Category.updateFile(filePath, data);
		req.data = require(filePath);
		next();
	},

};