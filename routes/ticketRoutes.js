const router = require('express').Router();
const chalk = require('chalk');
const TicketController = require('../controllers/TicketController');

const sendData = (req, res) => {
	// console.log(chalk.yellow('SENDING DATA : '), req.data);
	res.send(req.data);
};

router.get('/new', TicketController.getBlankTicket, sendData);

router.post('/new', TicketController.saveNewTicket, sendData);

router.get('/:id', TicketController.getTicket, sendData);

router.post('/:id', TicketController.updateTicket, sendData);

module.exports = router;


