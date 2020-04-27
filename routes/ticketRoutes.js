const router = require('express').Router();
const Ticket = require('../models/Ticket');
const chalk = require('chalk');


const sendData = (req, res) => {
	// console.log(chalk.yellow('SENDING DATA : '), req.data);
	res.send(req.data);
};

const getBlankTicket = (req, res, next) => {
	const { type } = req.query;
	const id = Ticket.getNewTicketId(type);
	const blankTicket = Ticket.getBlankTicket(id, type);
	req.data = blankTicket;
	next();
};

const getTicketData = async (req, res, next) => {
	const { id } = req.params;

	try {
		const ticket = await Ticket.findById(id);
		if (!ticket)
			return res.status(404).send('"ticketRoutes.js - getTicketData": ticket not found');
		req.data = ticket;
		next();
	}
	catch (e) {
		console.error(e);
		return res.status(500).send('"ticketRoutes.js - getTicketData": unknown error');
	}
};

const validateRawDataSchema = (req, res, next) => {
	try {
		Ticket.validateRawData(req.body);
		next();
	}
	catch (e) {
		return res.status(400).send('Invalid Data was posted');
	}
};

const saveNewTicket = async (req, res, next) => {
	let data = { ...req.body };
	data.log = data.id + ' was successfully created.';
	data = Ticket.format(data);
	// Save the entry;
	try {
		const ticket = await Ticket.createNew(data);
		console.log(ticket);
		req.data = ticket;
		next();
	}
	catch (e) {
		console.error(e);
		return res.status(400).send('"ticketRoutes.js - saveNewTicket": Could not save ticket, check the model');
	}
};

const updateTicket = async (req, res, next) => {
	let data = { ...req.body };

	try {
		let ticket = await Ticket.findById(data.id);
		data = Ticket.addChangeLog(ticket, data);
		data = Ticket.format(data);
		ticket = Ticket.merge(ticket, data);
		ticket = await Ticket.save(ticket);
		req.data = ticket;
		next();
	}
	catch (e) {
		console.error(e);
		return res.status(500).send('"TicketRoutes.js - updateTicket": could not update the ticket');
	}
};



router.get('/new', getBlankTicket, sendData);

router.post('/new', validateRawDataSchema, saveNewTicket, sendData);

router.get('/:id', getTicketData, sendData);

router.post('/:id', validateRawDataSchema, updateTicket, sendData);

module.exports = router;


