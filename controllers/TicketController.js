require('dotenv').config();
const chalk = require('chalk');
const Ticket = require('../models/Ticket');

module.exports = {

	getBlankTicket: function (req, res, next) {
		const { type } = req.query;
		try {
			req.data = new Ticket({ type }).blankTicket;
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
			await ticket.addCreationLog();
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
			req.data = ticket.record;
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
	}
};