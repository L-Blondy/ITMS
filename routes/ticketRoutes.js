const router = require('express').Router();
const chalk = require('chalk');
const TicketController = require('../controllers/TicketController');
const LiveUpdate = require('../controllers/LiveUpdate');

const sendData = (req, res) => {
	// console.log(chalk.yellow('SENDING DATA : '), req.data);
	res.send(req.data);
};

router.get(
	'/new',
	TicketController.getBlankTicket,
	sendData
);

router.get(
	'/:id',
	TicketController.getTicket,
	sendData
);

router.get(
	'/:id/subscribe',
	(req, res) => LiveUpdate.subscribe(req, res)
);

router.get(
	'/:id/:filename',
	TicketController.getFile
);

router.post(
	'/new',
	TicketController.saveNewTicket,
	sendData
);

router.post(
	'/:id',
	TicketController.updateTicket,
	(req, res) => LiveUpdate.dispatch(req, res)
);

router.post(
	'/:id/attach',
	TicketController.uploadFile.single('file'),
	TicketController.saveFileToDb,
	(req, res) => LiveUpdate.dispatch(req, res)
);

router.delete(
	'/:id/delete',
	TicketController.deleteFiles,
	(req, res) => LiveUpdate.dispatch(req, res)
	// (req, res) => res.send(req.body)
);

module.exports = router;
