require('dotenv').config();
const mongoose = require('mongoose');
const chalk = require('chalk');
const TicketController = require('../controllers/TicketController');

const res = {
	status() {
		return this;
	},
	send(data) {
		this.error = data;
	}
};

const next = () => { };

beforeAll(async done => {
	mongoose
		.set('useNewUrlParser', true)
		.set('useUnifiedTopology', true)
		.set('useFindAndModify', false)
		.set('useCreateIndex', true)
		.connect(process.env.DB_URL_TEST)
		.then(() => {
			console.log(chalk.bold.blue('# MongoDB Connected !'));
			done();
		})
		.catch(err => console.log(err));
});

afterAll(async done => {
	mongoose.connection.collections.incidents.drop(() => done());
});


test('GET BLANK TICKET', done => {
	const req1 = { query: { type: 'INC' } };
	const req2 = { query: { type: 'REQ' } };
	const req3 = { query: { type: 'CHG' } };

	TicketController.getBlankTicket(req1, res, next);
	TicketController.getBlankTicket(req2, res, next);
	TicketController.getBlankTicket(req3, res, next);

	expect(req1.data.id.length).toBe(10);
	expect(req2.data.id.length).toBe(10);
	expect(req3.data.id.length).toBe(10);
	res.error && console.log(res.error);
	done();
});

test('SAVE NEW TICKET', async done => {
	const req = {
		body: {
			id: 'INC0101012',
			description: 'test ticket',
			instructions: 'this is a test ticket',
			status: 'new',
			escalation: 0,
			log: '',
			user: 'test user',
			date: Date.now(),
			urgency: 4,
			impact: 4,
			priority: 'P4',
		}
	};
	await TicketController.saveNewTicket(req, res, next);

	expect(req.data.worknotesHistory[ 0 ].log).toBe('INC0101012 was successfully created.');
	expect(req.data.toObject().worknotesHistory.constructor.name).toBe('Array');
	res.error && console.log(res.error);
	done();
});

test('GET TICKET', async done => {
	const req = {
		params: { id: 'INC0101012' }
	};

	await TicketController.getTicket(req, res, next);

	expect(req.data).not.toBeNull();
	expect(req.data.id).toBe('INC0101012');
	res.error && console.log(res.error);
	done();
});

test('UPDATE TICKET', async done => {
	const req = {
		body: {
			id: 'INC0101012',
			description: 'test ticket updated',
			instructions: 'this is a test ticket updated',
			status: 'queued',
			escalation: 0,
			log: 'test update log',
			user: 'test user',
			date: Date.now(),
			urgency: 4,
			impact: 4,
			priority: 'P4',
		}
	};

	await TicketController.updateTicket(req, res, next);
	expect(req.data.worknotesHistory.length).toBe(3);
	expect(req.data.worknotesHistory[ 2 ].log).toBe('test update log');
	expect(req.data.worknotesHistory[ 1 ].type).toBe('changeLog');
	res.error && console.log(res.error);
	done();
});