const router = require('express').Router();
const SearchMW = require('../middlewares/SearchMW');
const TicketMW = require('../middlewares/TicketMW');
const LiveUpdate = require('../middlewares/LiveUpdate');

router.get(
	'/:type',
	SearchMW.handleSearch,
	SearchMW.sendData
);

router.get(
	'/:type/new',
	TicketMW.getBlankTicket,
	TicketMW.sendData
);

router.get(
	'/:type/:id',
	TicketMW.validateURL,
	TicketMW.getTicket,
	TicketMW.sendData
);

router.get(
	'/:type/:id/subscribe',
	(req, res) => LiveUpdate.subscribe(req, res)
);

router.get(
	'/:type/:id/:filename',
	TicketMW.getFile
);

router.post(
	'/:type/new',
	TicketMW.saveNewTicket,
	TicketMW.sendData
);

router.post(
	'/:type/:id',
	TicketMW.updateTicket,
	(req, res) => LiveUpdate.dispatch(req, res)
);

router.post(
	'/:type/:id/attach',
	TicketMW.uploadFile.single('file'),
	TicketMW.saveFileToDb,
	(req, res) => LiveUpdate.dispatch(req, res)
);

router.delete(
	'/:type/:id/delete',
	TicketMW.deleteFiles,
	(req, res) => LiveUpdate.dispatch(req, res)
);

router.delete(
	'/:type/:id',
	TicketMW.deleteTicket,
	TicketMW.sendData
);

module.exports = router;
