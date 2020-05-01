const { Schema, model } = require('mongoose');
const Joi = require('@hapi/joi');

const FileSchema = new Schema({
	originalname: String,
	mimetype: String,
	size: Number,
});

const WorknotesSchema = new Schema({
	type: {
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
	},
	log: String,
	file: FileSchema
});

const RequestSchema = new Schema({
	id: {
		type: String,
		index: true,
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
	assignmentGroup: {
		type: String,
		required: true
	},
	category: {
		type: String,
		required: true
	},
	subCategory: {
		type: String,
		required: true
	},

	assignedTo: String,
	onHoldReason: String,
	createdOn: {
		type: Date,
		required: true
	},
	worknotesHistory: {
		type: [ WorknotesSchema ],
		required: true
	},
});

const staticMethods = {

	blankTicket: (id) => ({
		id,
		description: '',
		instructions: '',
		status: 'new',
		escalation: 0,
		log: '',
		urgency: 4,
		impact: 4,
		priority: 'P4',
		assignedTo: '',
		assignmentGroup: '',
		onHoldReason: '',
		category: '',
		subCategory: '',
		createdOn: '',
		worknotesHistory: []
	}),

	JoiRawSchema: Joi.object({
		_id: Joi.string().optional(),
		__v: Joi.string().optional(),
		log: Joi.string().allow(''),
		id: Joi.string().min(10).max(10).required(),
		description: Joi.string().min(1).max(500).required(),
		instructions: Joi.string().min(1).max(500).required(),
		user: Joi.string().required(),
		date: Joi.date().required(),
		createdOn: Joi.date().required(),
		status: Joi.string().valid('new', 'queued', 'in progress', 'on hold', 'resolved', 'closed').required(),
		escalation: Joi.number().required(),
		urgency: Joi.number().min(1).max(4).required(),
		impact: Joi.number().min(1).max(4).required(),
		priority: Joi.string().min(2).max(2).required(),
		assignedTo: Joi.string().min(3).max(50).allow('').required(),
		assignmentGroup: Joi.string().min(3).max(50).allow('').required(),
		onHoldReason: Joi.string().allow('').required(),
		category: Joi.string().allow('').required(),
		subCategory: Joi.string().allow('').required(),
	})
};

const Request = model('request', RequestSchema);

module.exports = Request;
Object.assign(module.exports, staticMethods);