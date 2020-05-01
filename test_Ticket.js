require('dotenv').config();
const mongoose = require('mongoose');
const chalk = require('chalk');
const Ticket = require('./models/Ticket');

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

test('FORMAT DATA', async  done => {
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
		subCategory: '',
		category: '',
		onHoldReason: '',
		assignmentGroup: '',
		assignedTo: ''
	};

	const ticket = new Ticket({ data: raw });
	await ticket.formatData();

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

test('VALIDATE RAW INCIDENT DATA', async done => {
	const rawData1 = {
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
		subCategory: '',
		category: '',
		onHoldReason: '',
		assignmentGroup: '',
		assignedTo: ''
	};
	const ticket = new Ticket({ data: rawData1 });
	await ticket.addCreatedOn();
	const error = ticket.model.JoiRawSchema.validate(ticket.data).error;
	expect(error).toBeUndefined();
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
		category: 'some category',
		subCategory: 'some sub-category',
		onHoldReason: 'some reason',
		assignmentGroup: 'some group',
		assignedTo: 'some person'
	};

	const ticket = new Ticket({ data: raw });
	await ticket.addCreatedOn();
	await ticket.addCreationLog();
	await ticket.validateRawData();
	await ticket.formatData();
	await ticket.newRecord();

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
		log: 'SOME NEW LOG',
		user: 'test user',
		date: Date.now(),
		urgency: 4,
		impact: 4,
		priority: 'P4',
		category: 'some category UPDATED',
		subCategory: 'some sub-category',
		onHoldReason: 'some reason',
		assignmentGroup: 'some group',
		assignedTo: 'some person'
	};

	const ticket = new Ticket({ data: newData });
	await ticket.findRecord();
	await ticket.addChangeLog();
	await ticket.formatData();
	await ticket.updateRecord();

	expect(ticket.record.worknotesHistory.length).toBe(3);
	expect(ticket.record.log).toBeUndefined();
	done();
});

test('SAVE FILE LOG', async done => {
	const id = 'INC0101012';
	const user = 'some random user';
	const file = {
		fieldname: 'file',
		originalname: 'testFile.txt',
		encoding: '7bit',
		mimetype: 'text/plain',
		buffer: new Buffer.from('this is a test file'),
		size: 199153
	};

	const ticket = new Ticket({ id });
	await ticket.findRecord();
	await ticket.saveFileLog(file, user);

	expect(ticket.record.worknotesHistory.length).toBe(4);
	expect(ticket.record.worknotesHistory[ 3 ].type).toBe('fileLog');
	expect(ticket.record.worknotesHistory[ 3 ].file).not.toBeNull();
	expect(ticket.record.worknotesHistory[ 3 ].file).not.toBeUndefined();
	done();
});

