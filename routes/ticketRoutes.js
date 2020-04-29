const router = require('express').Router();
const chalk = require('chalk');
const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');
const TicketController = require('../controllers/TicketController');
const FileTest = require('../models/FileTest');

const sendData = (req, res) => {
	// console.log(chalk.yellow('SENDING DATA : '), req.data);
	res.send(req.data);
};

router.get('/new', TicketController.getBlankTicket, sendData);

router.post('/new', TicketController.saveNewTicket, sendData);

router.get('/:id', TicketController.getTicket, sendData);

router.post('/:id', TicketController.updateTicket, sendData);

router.post('/:id/attach', multer({ dest: 'uploads/' }).single('attachment'), (req, res) => {
	const allowedExtnames = new Set([ '.pdf', '.jpg', '.png' ]);
	const tempPath = req.file.path;
	const targetPath = path.join(__dirname, '../uploads/' + req.file.originalname);
	const extName = path.extname(req.file.originalname).toLowerCase();

	console.log(req.file);
	if (allowedExtnames.has(extName)) {
		fs
			.rename(tempPath, targetPath)
			.then(async () => {
				const file = await new FileTest({
					name: req.file.originalname,
					data: req.file
				}).save();
				console.log(file);
				return file;
			})
			.then(() => res.send('file uploaded with success'))
			.catch(e => res.status(500).send(e));
	}
	else {
		fs
			.unlink(tempPath)
			.then(() => res.status(403).send(extName + ' files are not allowed'));
	}
});

module.exports = router;


