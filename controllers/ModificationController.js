require('dotenv').config();
const path = require('path');
const fs = require('fs');
const Category = require('../models/Category');

module.exports = {

	getCategories: async function (req, res, next) {
		const { type } = req.params;
		const filePath = Category.getFilePath(type);
		req.data = { modify: require(filePath) };
		next();
	},

	updateCategories: async function (req, res, next) {
		const { type } = req.params;
		const data = req.body;
		const filePath = Category.getFilePath(type);
		await Category.updateFile(filePath, data);
		next();
	},

};