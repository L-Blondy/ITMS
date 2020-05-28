const router = require('express').Router();
const Ticket = require('../models/ticket/Ticket');

router.get('/', (req, res) => {
	req.data = 1;
	// const { type } = req.query;
	// const ticket = new Ticket({ type });
	// req.data = ticket.model;
	// console.log(req.data);
	res.send({ reportData: req.data });
});

module.exports = router;