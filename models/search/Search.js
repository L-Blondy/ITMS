const fs = require('fs');
const path = require('path');
const Incident = require('../ticket/Incident');
const Request = require('../ticket/Request');
const Change = require('../ticket/Change');

class Search {

	constructor(type) {
		this.type = type;
		this.model = this._getModel();
		this.pageSize = 5;
		this.searchParams = {};
	}

	_getModel() {
		switch (this.type) {
			case 'incidents':
				return Incident;
			case 'requests':
				return Request;
			case 'changes':
				return Change;
		}
	}

	async find(query) {
		if (!query.page)
			query.page = 1;

		this.searchParams = Object.entries(query).reduce((searchParams, entry) => {
			let [ prop, value ] = entry;
			const searchANumber = prop === 'escalation' || prop === 'page';
			const searchADate = !isNaN(value) && parseInt(value) > 86400023;

			//skip 'page'
			if (prop === 'page')
				return searchParams;
			//prop is stored as a number
			if (searchANumber) {
				searchParams[ prop ] = value;
			}
			//search a date
			else if (searchADate) {
				value = parseInt(value);
				searchParams[ prop ] = { $gte: value, $lte: value + 86400000 }; //date < results < date + 1 day
			}
			//search a string or a numbe rwithin a string
			else {
				searchParams[ prop ] = { $regex: new RegExp(value), $options: 'ix' };
			}
			return searchParams;
		}, {});

		return await this.model
			.find(this.searchParams)
			.skip((query.page - 1) * this.pageSize)
			.limit(this.pageSize);
	}
	async count() {
		return await this.model.count(this.searchParams);
	}
}

module.exports = Search;

