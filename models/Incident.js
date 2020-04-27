const { Schema, model } = require('mongoose');
const Joi = require('@hapi/joi');

const WorknotesSchema = new Schema({
	type: {
		type: String,
		required: true
	},
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

const IncidentSchema = new Schema({
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
	urgency: {
		type: Number,
		required: true
	},
	impact: {
		type: Number,
		required: true
	},
	priority: {
		type: String,
		required: true
	},
	worknotesHistory: {
		type: [ WorknotesSchema ],
		default: []
	},
});

IncidentSchema.index({ id: 1, type: -1 });

const Incident = model('incident', IncidentSchema);

module.exports = Incident;

module.exports.JoiRawSchema = Joi.object({
	_id: Joi.string(),
	__v: Joi.string(),
	log: Joi.string().allow(''),
	id: Joi.string().min(10).max(10).required(),
	description: Joi.string().min(1).max(500).required(),
	instructions: Joi.string().min(1).max(500).required(),
	user: Joi.string().required(),
	date: Joi.date().required(),
	status: Joi.string().valid('new', 'queued', 'in progress', 'on hold', 'resolved', 'closed').required(),
	escalation: Joi.number().required(),
	urgency: Joi.number().min(1).max(4).required(),
	impact: Joi.number().min(1).max(4).required(),
	priority: Joi.string().min(2).max(2).required(),
});

module.exports.blankTicket = (id) => ({
	id,
	description: '',
	instructions: '',
	status: 'new',
	escalation: 0,
	log: '',
	urgency: 4,
	impact: 4,
	priority: 'P4',
	worknotesHistory: []
});
