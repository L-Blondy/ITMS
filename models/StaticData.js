const { Schema, model } = require('mongoose');
const Joi = require('@hapi/joi');

const StaticDataSchema = new Schema({
	'INC': {
		category: [ String ],
		subCategory: [ String ],
	},
	'REQ': {
		category: [ String ],
		subCategory: [ String ],
	},
	'CHG': {
		category: [ String ],
		subCategory: [ String ],
	},
});

const StaticData = model('staticdata', StaticDataSchema);

module.exports = StaticData;