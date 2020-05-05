require('dotenv').config();
const path = require('path');
const chalk = require('chalk');
const multer = require('multer');
const Ticket = require('../models/Ticket');
const fs = require('fs');

module.exports = {

	getBlankTicket: async function (req, res, next) {
		const { type } = req.query;
		try {
			const ticket = new Ticket({ type });
			await ticket.setStaticData();
			const blankTicket = ticket.blankTicket;
			blankTicket.staticData = ticket.staticData;
			req.data = blankTicket;
			next();
		}
		catch (e) {
			console.error(e);
			return res.status(400).send(e.message);
		}
	},

	saveNewTicket: async function (req, res, next) {
		const data = req.body;

		try {
			const ticket = new Ticket({ data });
			await ticket.addCreatedOn();
			await ticket.addDueDate();
			await ticket.addCreationLog();
			await ticket.validateRawData();
			await ticket.formatData();
			await ticket.newRecord();
			req.data = ticket.record;
			next();
		}
		catch (e) {
			console.error(e);
			return res.status(400).send(e.message);
		}
	},

	getTicket: async function (req, res, next) {
		const { id } = req.params;

		try {
			const ticket = new Ticket({ id });
			await ticket.findRecord();
			await ticket.setStaticData();
			const data = ticket.record.toObject();
			data.staticData = ticket.staticData;
			req.data = data;
			next();
		}
		catch (e) {
			console.error(e);
			return res.status(400).send(e.message);
		}
	},

	updateTicket: async function (req, res, next) {
		const data = req.body;

		try {
			const ticket = new Ticket({ data });
			await ticket.validateRawData();
			await ticket.findRecord();
			await ticket.addChangeLog();
			await ticket.formatData();
			await ticket.updateRecord();
			req.data = ticket.record;
			next();
		}
		catch (e) {
			console.error(e);
			return res.status(400).send(e.message);
		}
	},

	uploadFile: multer({

		fileFilter: (req, file, allow) => {
			const allowedExtnames = new Set([ '.pdf', '.jpg', '.jpeg', '.png', '.svg' ]);
			const extName = path.extname(file.originalname).toLowerCase();
			req.extName = extName;

			if (allowedExtnames.has(extName)) {
				allow(null, true);
			}
			else {
				allow(null, false);
			}
		},
		storage: multer.diskStorage({
			destination: (req, file, cb) => {
				const dir = path.join(__dirname, '../assets', req.params.id);
				if (!fs.existsSync(dir))
					fs.mkdirSync(dir);
				cb(null, 'assets/' + req.params.id);
			},
			filename: (req, file, cb) => {
				cb(null, file.originalname);
			}
		}),
	}),

	saveFileToDb: async function (req, res, next) {
		if (!req.file)
			return res.status(400).send(req.extName + ' files are not allowed');

		const file = req.file;
		const user = req.body.user;
		const id = req.params.id;

		try {
			const ticket = new Ticket({ id });
			await ticket.findRecord();
			await ticket.saveFileLog(file, user);
			req.data = ticket.record;
			next();
		}
		catch (e) {
			console.log('Attachment could not be saved to MongoDB', e);
			return res.status(500).send('Attachment could not be saved to MongoDB');
		}
	},

	getFile: async function (req, res) {
		const filePath = path.join(__dirname, '../assets', req.params.id, req.params.filename);
		res.sendFile(filePath);
	}
};