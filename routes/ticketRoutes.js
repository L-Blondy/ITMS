const router = require('express').Router();
const chalk = require('chalk');
const TicketController = require('../controllers/TicketController');
const LiveUpdate = require('../controllers/LiveUpdate');

const sendData = (req, res) => {
	// console.log(chalk.yellow('SENDING DATA : '), req.data);
	res.send(req.data);
};

router.get('/new', TicketController.getBlankTicket, sendData);

router.post('/new', TicketController.saveNewTicket, (req, res) => LiveUpdate.dispatch(req, res));

router.get('/:id', TicketController.getTicket, sendData);

router.post('/:id', TicketController.updateTicket, (req, res) => LiveUpdate.dispatch(req, res));

router.post(
	'/:id/attach',
	TicketController.uploadFile.single('file'),
	TicketController.saveFile,
	sendData
);

router.get('/:id/subscribe', (req, res) => LiveUpdate.subscribe(req, res));

module.exports = router;


// send file:

// const file = req.data;

// 		const mimetype = file.mimetype;
// 		const b64 = new Buffer.from(file.data).toString('base64');
// 		const src = `data:${ mimetype };base64,${ b64 }`;
// 		const name = file.name;

// 		res.send({ src, name });