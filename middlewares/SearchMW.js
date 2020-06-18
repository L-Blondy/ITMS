const Search = require('../models/search/Search');

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
				startFrom: parseInt(req.query.startFrom),
				query: req.query
			};
			next();
		}
		catch (err) {
			console.log(err);
			req.data = {
				results: [],
				resultsCount: 0,
				skipped: 0,
				query: req.query
			};
			next();
		}
	},

	sendData: function (req, res) {
		res.send({ searchData: req.data });
	}
};