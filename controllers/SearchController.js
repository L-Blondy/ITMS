require('dotenv').config();
const path = require('path');
const Search = require('../models/search/Search');
const fs = require('fs');

module.exports = {

	handleSearch: async function (req, res, next) {
		const { type } = req.params;
		console.log(req.query, type);
		try {
			const search = new Search(type);
			const data = await search.find(req.query);
			const resultsCount = await search.count();

			req.data = {
				results: data,
				resultsCount,
				skipped: parseInt(req.query.skip),
			};
			next();
		}
		catch (err) {
			console.log(err);
			req.data = {
				results: [],
				resultsCount: 0,
				skipped: 0,
			};
			next();
		}
	},

	sendData: function (req, res) {
		res.send({ searchData: req.data });
	}
};