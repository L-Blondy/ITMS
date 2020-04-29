require('dotenv').config();
const mongoose = require('mongoose');
const chalk = require('chalk');
const Ticket = require('../models/Ticket');

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

/****************
 * SETUP END
 */

test('GET BLANK TICKET', done => {
	const blankTicket = new Ticket({ type: 'INC' }).blankTicket;

	expect(blankTicket.id.length).toBe(10);
	expect(blankTicket.id.slice(0, 3)).toBe('INC');
	expect(blankTicket.status).toBe('new');
	expect(blankTicket.worknotesHistory).toEqual([]);
	done();
});

test('FORMAT DATA', done => {
	const raw = {
		id: 'INC0101012',
		description: 'test ticket',
		instructions: 'this is a test ticket',
		status: 'new',
		escalation: 0,
		log: 'test log',
		user: 'test user',
		date: Date.now(),
		urgency: 4,
		impact: 4,
		priority: 'P4',
	};

	const ticket = new Ticket({ data: raw }).formatData();

	expect(ticket.data.log).toBeUndefined();
	expect(ticket.data.date).toBeUndefined();
	expect(ticket.data.user).toBeUndefined();
	expect(ticket.data.id).toBe('INC0101012');
	expect(ticket.data.worknotesHistory.length).toBe(1);
	expect(ticket.data.worknotesHistory[ 0 ].log).toBe(raw.log);
	expect(ticket.data.worknotesHistory[ 0 ].date).toBe(raw.date);
	expect(ticket.data.worknotesHistory[ 0 ].user).toBe(raw.user);
	done();
});

test('CREATE NEW TICKET', async done => {
	const raw = {
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
	};

	const ticket = new Ticket({ data: raw });
	await ticket.addCreationLog();
	await ticket.formatData();
	await ticket.newRecord();
	console.log(ticket.record.worknotesHistory);

	expect(ticket.record.log).toBeUndefined();
	expect(ticket.record.date).toBeUndefined();
	expect(ticket.record.user).toBeUndefined();
	expect(ticket.record.id).toBe('INC0101012');
	expect(ticket.record.worknotesHistory.length).toBe(1);
	expect(ticket.record.worknotesHistory[ 0 ].log).toBe(raw.log);
	expect(ticket.record.worknotesHistory[ 0 ].user).toBe(raw.user);
	done();
});

test('FIND A TICKET', async done => {
	const ticket = new Ticket({ id: 'INC0101012' });
	await ticket.findRecord();

	expect(ticket.record.log).toBeUndefined();
	expect(ticket.record.date).toBeUndefined();
	expect(ticket.record.user).toBeUndefined();
	expect(ticket.record.id).toBe('INC0101012');
	expect(ticket.record.worknotesHistory.length).toBe(1);
	expect(ticket.record.worknotesHistory[ 0 ].log).toBe('INC0101012 created with success.');
	expect(ticket.record.worknotesHistory[ 0 ].user).toBe('test user');
	done();
});

test('UPDATE A TICKET', async done => {
	const newData = {
		id: 'INC0101012',
		description: 'test ticket UPDATED',
		instructions: 'this is a test ticket UPDATED',
		status: 'new',
		escalation: 0,
		log: 'test log UPDATED',
		user: 'test user',
		date: Date.now(),
		urgency: 4,
		impact: 4,
		priority: 'P4',
	};

	const ticket = new Ticket({ data: newData });
	await ticket.findRecord();
	await ticket.addChangeLog();
	await ticket.formatData();
	await ticket.updateRecord();

	expect(ticket.record.worknotesHistory.length).toBe(3);
	expect(ticket.record.log).toBeUndefined();
	expect(ticket.record.worknotesHistory[ 1 ].log).toBe('description field was updated from test ticket to test ticket UPDATED\n' + 'instructions field was updated from this is a test ticket to this is a test ticket UPDATED\n');
	done();
});