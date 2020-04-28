require('dotenv').config();
const chalk = require('chalk');
const Ticket = require('../models/TicketMethods');

module.exports = {

	getBlankTicket: function (req, res, next) {
		const { type } = req.query;
		const TicketModel = Ticket.getModel(type);
		const id = Ticket.getNewId(type);
		req.data = TicketModel.blankTicket(id);
		next();
	},

	saveNewTicket: async function (req, res, next) {
		const rawData = req.body;

		const TicketModel = Ticket.getModel(rawData.id);
		const EM = Ticket.validateRaw(TicketModel, rawData);
		if (EM)
			return res.status(400).send(EM);

		rawData.log = rawData.id + ' was successfully created.';
		const data = Ticket.formatRaw(rawData);

		try {
			const ticket = await new TicketModel(data).save();
			req.data = ticket;
			next();
		}
		catch (e) {
			console.error('could not save new ticket');
			return res.status(500).send('could not save new ticket');
		}
	},

	getTicket: async function (req, res, next) {
		const { id } = req.params;
		const TicketModel = Ticket.getModel(id);
		const ticket = await TicketModel
			.findOne({ id })
			.lean()
			.populate();

		if (!ticket)
			return res.status(404).send('Ticket ' + id + ' not found');

		req.data = ticket;
		next();
	},

	updateTicket: async function (req, res, next) {
		let rawData = req.body;

		const TicketModel = Ticket.getModel(rawData.id);

		const EM = Ticket.validateRaw(TicketModel, rawData);
		if (EM)
			return res.status(400).send(EM);

		let ticket = await TicketModel.findOne({ id: rawData.id });
		if (!ticket)
			return res.status(404).send('Ticket ' + id + ' not found');

		rawData = Ticket.addChangeLog(rawData, ticket);
		data = Ticket.formatRaw(rawData);

		try {
			req.data = await Ticket.merge(ticket, data).save();
			next();
		}
		catch (e) {
			console.error('Could not update ticket ' + data.id);
			return res.status(500).send('Could not update ticket ' + data.id);
		}
	}
};