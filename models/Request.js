const { Schema, model } = require('mongoose');
const Joi = require('@hapi/joi');

const WorknotesSchema = new Schema({
	log: {
		type: String,
		required: true
	},
	user: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	}
});

const RequestSchema = new Schema({
	id: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	instructions: {
		type: String,
		required: true
	},
	status: {
		type: String,
		required: true
	},
	escalation: {
		type: Number,
		required: true
	},
	worknotesHistory: {
		type: [ WorknotesSchema ],
		default: []
	},
});

const Request = model('request', RequestSchema);

module.exports = Request;

module.exports.JoiSchema = Joi.object({
	_id: Joi.string(),
	__v: Joi.string(),
	log: Joi.string().allow(''),
	id: Joi.string().min(10).max(10).required(),
	description: Joi.string().min(1).max(500).required(),
	instructions: Joi.string().min(1).max(500).required(),
	user: Joi.string().required(),
	date: Joi.date().required(),
	status: Joi.string().required(),
	escalation: Joi.number().required(),
});

module.exports.blankTicket = (id) => ({
	id,
	description: '',
	instructions: '',
	status: 'new',
	escalation: 0,
	log: '',
	worknotesHistory: []
});
