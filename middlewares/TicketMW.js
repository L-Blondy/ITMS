require('dotenv').config();
const path = require('path');
const multer = require('multer');
const Ticket = require('../models/ticket/Ticket');
const fs = require('fs');

module.exports = {

	handleSearch: async function (req, res, next) {
		try {
			const { type } = req.params;
			const ticket = new Ticket({ type });
			const tickets = await ticket.model.find({});
			req.data = tickets;
			next();
		}
		catch (err) {
			return res.status(400).send('Wrong request');
		}
	},

	validateURL: async function (req, res, next) {
		const { type, id } = req.params;
		const prefix = id.slice(0, 3);
		if (!type || !id
			|| type === 'incidents' && prefix !== 'INC'
			|| type === 'requests' && prefix !== 'REQ'
			|| type === 'changes' && prefix !== 'CHG'
		) {
			return res.status(404).send('Wrong URL');
		}
		next();
	},

	getBlankTicket: async function (req, res, next) {
		const { type } = req.params;

		try {
			const ticket = new Ticket({ type });
			await ticket.setCategories();
			const blankTicket = ticket.blankTicket;
			blankTicket.categories = ticket.categories;
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
			await ticket.addUpdatedOn();
			await ticket.addUpdatedBy();
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
			await ticket.setCategories();
			const data = ticket.record.toObject();
			data.categories = ticket.categories;
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
			await ticket.findRecord();
			await ticket.addUpdatedOn();
			await ticket.addUpdatedBy();
			await ticket.addChangeLog();
			await ticket.validateRawData();
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
			const allowedExtnames = new Set([ '.pdf', '.jpg', '.jpeg', '.png', '.svg', '.gif', '.rar', '.txt' ]);
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
		const { user, date } = req.body;
		const id = req.params.id;
		const data = { id, user, date };

		try {
			const ticket = new Ticket({ data });
			await ticket.findRecord();
			await ticket.addUpdatedOn();
			await ticket.addUpdatedBy();
			await ticket.formatData();
			await ticket.saveFileLog(file, user);
			await ticket.updateFileList(file);
			await ticket.updateRecord();
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
	},

	deleteFiles: async function (req, res, next) {
		const { toDelete: fileNames, date, user } = req.body;
		const id = req.params.id;
		const data = { id, date, user };

		try {
			const ticket = new Ticket({ data });
			await ticket.findRecord();
			await ticket.addUpdatedOn();
			await ticket.addUpdatedBy();
			await ticket.formatData();
			await ticket.updateRecord();
			await ticket.updateFileList(fileNames, 'delete');

			fileNames.forEach(fileName => {
				const filePath = path.join(__dirname, '../assets', id, fileName);
				fs.unlink(filePath, (e) => { });
			});
			req.data = ticket.record;
			next();
		}
		catch (err) {
			console.log(err);
			return res.status(500).send('Could not delete the file(s)');
		}
	},

	deleteTicket: async function (req, res, next) {
		const { id } = req.params;

		try {
			const ticket = new Ticket({ id });
			const deletion = await ticket.delete();
			req.data = { deletedCount: deletion.deletedCount };
			next();
		}
		catch (err) {
			return res.status(500).send('Could not delete the ticket');
		}
	},

	sendData: function (req, res) {
		res.send(req.data);
	}
};