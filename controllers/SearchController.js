require('dotenv').config();
const path = require('path');
const Search = require('../models/search/Search');
const fs = require('fs');

module.exports = {

	handleSearch: async function (req, res, next) {
		const { type } = req.params;
		try {
			const search = new Search(type);
			const data = await search.find(req.query);
			const totalCount = await search.count();
			console.log(totalCount, search.pageSize);
			req.data = {
				results: data,
				query: req.query,
				totalCount,
				pageSize: search.pageSize
			};
			next();
		}
		catch (err) {
			console.log(err);
			req.data = {
				results: [],
				query: req.query,
				totalCount: 0,
				pageSize: 0
			};
			next();
		}
	},

	sendData: function (req, res) {
		res.send({ searchData: req.data });
	}
};