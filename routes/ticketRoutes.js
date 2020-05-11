const router = require('express').Router();
const chalk = require('chalk');
const TicketController = require('../controllers/TicketController');
const LiveUpdate = require('../controllers/LiveUpdate');

const sendData = (req, res) => {
	res.send(req.data);
};

router.get(
	'/:type/new',
	TicketController.getBlankTicket,
	sendData
);

router.get(
	'/:type/:id',
	TicketController.validateURL,
	TicketController.getTicket,
	sendData
);

router.get(
	'/:type/:id/subscribe',
	(req, res) => LiveUpdate.subscribe(req, res)
);

router.get(
	'/:type/:id/:filename',
	TicketController.getFile
);

router.post(
	'/:type/new',
	TicketController.saveNewTicket,
	sendData
);

router.post(
	'/:type/:id',
	TicketController.updateTicket,
	(req, res) => LiveUpdate.dispatch(req, res)
);

router.post(
	'/:type/:id/attach',
	TicketController.uploadFile.single('file'),
	TicketController.saveFileToDb,
	(req, res) => LiveUpdate.dispatch(req, res)
);

router.delete(
	'/:type/:id/delete',
	TicketController.deleteFiles,
	(req, res) => LiveUpdate.dispatch(req, res)
	// (req, res) => res.send(req.body)
);

module.exports = router;
