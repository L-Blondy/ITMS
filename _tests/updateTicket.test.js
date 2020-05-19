const mongoose = require('mongoose');
const request = require('supertest');
const AppForTests = require('./app.js');
const TicketController = require('../controllers/TicketController');
let app;

beforeAll(async done => {
	app = await AppForTests(false);
	app.post(
		'/it/ticket/:type/:id/test',
		TicketController.updateTicket,
		(req, res) => res.send(req.data)
	);

	done();
});
afterAll(done => mongoose.disconnect().then(() => done()));

const rawINC = {
	id: 'INC0000001',
	log: 'UPDATED',
	description: 'UPDATED',
	instructions: 'UPDATED',
	status: 'new',
	escalation: 0,
	user: 'test user',
	date: Date.now(),
	updatedOn: Date.now(),
	createdOn: Date.now(),
	dueDate: Date.now(),
	urgency: 4,
	impact: 4,
	priority: 'P4',
	category: 'some category',
	subCategory: 'some sub category',
	assignmentGroup: 'some group',
	assignedTo: '',
	onHoldReason: '',
	fileList: [],
};
const rawREQ = {
	id: 'REQ0000001',
	log: 'UPDATED',
	description: 'UPDATED',
	instructions: 'UPDATED',
	status: 'new',
	escalation: 0,
	user: 'test user',
	date: Date.now(),
	updatedOn: Date.now(),
	createdOn: Date.now(),
	dueDate: Date.now(),
	urgency: 4,
	impact: 4,
	priority: 'P4',
	category: 'some category',
	subCategory: 'some sub category',
	assignmentGroup: 'some group',
	assignedTo: '',
	onHoldReason: '',
	fileList: [],
};
const rawCHG = {
	id: 'CHG0000001',
	log: 'UPDATED',
	description: 'UPDATED',
	instructions: 'UPDATED',
	status: 'new',
	escalation: 0,
	user: 'test user',
	date: Date.now(),
	updatedOn: Date.now(),
	createdOn: Date.now(),
	dueDate: Date.now(),
	urgency: 4,
	impact: 4,
	priority: 'P4',
	category: 'some category',
	subCategory: 'some sub category',
	assignmentGroup: 'some group',
	assignedTo: '',
	onHoldReason: '',
	fileList: [],
};

describe('UPDATE TICKET', () => {

	test('Incident', async done => {

		request(app)
			.post('/it/ticket/incidents/INC0000001/test')
			.send(rawINC)
			.then(res => {
				expect(res.body[ 'description' ]).toBe('UPDATED');
				expect(res.body[ 'instructions' ]).toBe('UPDATED');
				expect(res.body[ 'worknotesHistory' ].length).toBe(3);
				expect(res.body[ 'worknotesHistory' ][ 2 ].log).toBe('UPDATED');
				done();
			});
	});

	test('Request', async done => {
		request(app)
			.post('/it/ticket/requests/REQ0000001/test')
			.send(rawREQ)
			.then(res => {
				expect(res.body[ 'description' ]).toBe('UPDATED');
				expect(res.body[ 'instructions' ]).toBe('UPDATED');
				expect(res.body[ 'worknotesHistory' ].length).toBe(3);
				expect(res.body[ 'worknotesHistory' ][ 2 ].log).toBe('UPDATED');
				done();
			});
	});

	test('Change', async done => {
		request(app)
			.post('/it/ticket/changes/CHG0000001/test')
			.send(rawCHG)
			.then(res => {
				expect(res.body[ 'description' ]).toBe('UPDATED');
				expect(res.body[ 'instructions' ]).toBe('UPDATED');
				expect(res.body[ 'worknotesHistory' ].length).toBe(3);
				expect(res.body[ 'worknotesHistory' ][ 2 ].log).toBe('UPDATED');
				done();
			});
	});
});
