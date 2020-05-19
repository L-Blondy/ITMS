require('dotenv').config();
const path = require('path');
const Search = require('../models/search/Search');
const fs = require('fs');

module.exports = {

	handleSearch: async function (req, res, next) {
		const { type } = req.params;
		const search = new Search(type);
		const data = await search.find(req.query);
		req.data = data;
		next();
	},

	sendData: function (req, res) {
		res.send({ searchData: req.data });
	}
};