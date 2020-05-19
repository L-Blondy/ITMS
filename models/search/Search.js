const fs = require('fs');
const path = require('path');
const Incident = require('../ticket/Incident');
const Request = require('../ticket/Request');
const Change = require('../ticket/Change');

class Search {

	constructor(type) {
		this.type = type;
		this.model = this._getModel();
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
		return await this.model.find(query).lean().populate();
	}
};

module.exports = Search;

