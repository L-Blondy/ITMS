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

const ChangeSchema = new Schema({
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
	createdOn: {
		type: Number,
		required: true
	},
	updatedOn: {
		type: Number,
		required: true
	},
	updatedBy: {
		type: String,
		required: true
	},
	dueDate: {
		type: Number,
		required: true
	},
	fileList: {
		type: [ {
			name: String,
			size: Number,
			mimetype: String
		} ],
		required: true
	},

	assignedTo: String,
	onHoldReason: String,
	worknotesHistory: {
		type: [ WorknotesSchema ],
		required: true
	},
}, { collation: { locale: 'en', strength: 1 } });

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
		updatedOn: '',
		updatedBy: '',
		dueDate: '',
		fileList: [],
		worknotesHistory: []
	}),

	JoiRawSchema: Joi.object({
		_id: Joi.string().optional(),
		__v: Joi.string().optional(),
		log: Joi.string().allow(''),
		id: Joi.string().min(10).max(10).required(),
		description: Joi.string().min(1).max(500).required(),
		instructions: Joi.string().min(1).max(2000).required(),
		changeLog: Joi.string().optional().allow(''),
		user: Joi.string().required(),
		date: Joi.date().required(),
		createdOn: Joi.date().required(),
		updatedOn: Joi.date().required(),
		updatedBy: Joi.string().required(),
		dueDate: Joi.date().required(),
		status: Joi.string().valid('new', 'queued', 'in progress', 'on hold', 'resolved', 'closed').required(),
		escalation: Joi.number().required(),
		urgency: Joi.number().min(1).max(4).required(),
		impact: Joi.number().min(1).max(4).required(),
		priority: Joi.string().min(2).max(2).required(),
		assignedTo: Joi.string().max(50).allow('').required(),
		assignmentGroup: Joi.string().max(50).required(),
		onHoldReason: Joi.string().allow('').required(),
		categories: Joi.object().optional(),
		category: Joi.string().required(),
		subCategory: Joi.string().required(),
		fileList: Joi.array().optional(),
	})
};

const Change = model('change', ChangeSchema);

module.exports = Change;
Object.assign(module.exports, staticMethods);