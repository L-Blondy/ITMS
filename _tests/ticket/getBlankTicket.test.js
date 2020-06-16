const mongoose = require('mongoose');
const request = require('supertest');
const AppForTests = require('../app.js');
let app;

beforeAll(async done => {
	app = await AppForTests();
	done();
});
afterAll(done => mongoose.disconnect().then(() => done()));

describe('GET BLANK', () => {

	test('incident', done => {

		request(app)
			.get('/it/ticket/incidents/new')
			.then((res) => {
				expect(res.body[ 'id' ].startsWith('INC')).toBeTruthy();
				expect(res.body[ 'id' ].length).toBe(10);
				expect(res.body[ 'description' ]).toBe('');
				expect(res.body[ 'instructions' ]).toBe('');
				expect(res.body[ 'status' ]).toBe('new');
				expect(res.body[ 'escalation' ]).toBe(0);
				expect(res.body[ 'log' ]).toBe('');
				expect(res.body[ 'urgency' ]).toBe(4);
				expect(res.body[ 'impact' ]).toBe(4);
				expect(res.body[ 'priority' ]).toBe('P4');
				expect(res.body[ 'assignedTo' ]).toBe('');
				expect(res.body[ 'assignmentGroup' ]).toBe('');
				expect(res.body[ 'onHoldReason' ]).toBe('');
				expect(res.body[ 'category' ]).toBe('');
				expect(res.body[ 'subCategory' ]).toBe('');
				expect(res.body[ 'createdOn' ]).toBe('');
				expect(res.body[ 'updatedOn' ]).toBe('');
				expect(res.body[ 'dueDate' ]).toBe('');
				expect(typeof res.body[ 'worknotesHistory' ]).toBe('object');
				expect(typeof res.body[ 'categories' ]).toBe('object');
				done();
			});
	});

	test('request', done => {

		request(app)
			.get('/it/ticket/requests/new')
			.then((res) => {
				expect(res.body[ 'id' ].startsWith('REQ')).toBeTruthy();
				expect(res.body[ 'id' ].length).toBe(10);
				expect(res.body[ 'description' ]).toBe('');
				expect(res.body[ 'instructions' ]).toBe('');
				expect(res.body[ 'status' ]).toBe('new');
				expect(res.body[ 'escalation' ]).toBe(0);
				expect(res.body[ 'log' ]).toBe('');
				expect(res.body[ 'urgency' ]).toBe(4);
				expect(res.body[ 'impact' ]).toBe(4);
				expect(res.body[ 'priority' ]).toBe('P4');
				expect(res.body[ 'assignedTo' ]).toBe('');
				expect(res.body[ 'assignmentGroup' ]).toBe('');
				expect(res.body[ 'onHoldReason' ]).toBe('');
				expect(res.body[ 'category' ]).toBe('');
				expect(res.body[ 'subCategory' ]).toBe('');
				expect(res.body[ 'createdOn' ]).toBe('');
				expect(res.body[ 'updatedOn' ]).toBe('');
				expect(typeof res.body[ 'worknotesHistory' ]).toBe('object');
				expect(typeof res.body[ 'categories' ]).toBe('object');
				done();
			});
	});
	test('change', done => {

		request(app)
			.get('/it/ticket/changes/new')
			.then((res) => {
				expect(res.body[ 'id' ].startsWith('CHG')).toBeTruthy();
				expect(res.body[ 'id' ].length).toBe(10);
				expect(res.body[ 'description' ]).toBe('');
				expect(res.body[ 'instructions' ]).toBe('');
				expect(res.body[ 'status' ]).toBe('new');
				expect(res.body[ 'escalation' ]).toBe(0);
				expect(res.body[ 'log' ]).toBe('');
				expect(res.body[ 'urgency' ]).toBe(4);
				expect(res.body[ 'impact' ]).toBe(4);
				expect(res.body[ 'priority' ]).toBe('P4');
				expect(res.body[ 'assignedTo' ]).toBe('');
				expect(res.body[ 'assignmentGroup' ]).toBe('');
				expect(res.body[ 'onHoldReason' ]).toBe('');
				expect(res.body[ 'category' ]).toBe('');
				expect(res.body[ 'subCategory' ]).toBe('');
				expect(res.body[ 'createdOn' ]).toBe('');
				expect(res.body[ 'updatedOn' ]).toBe('');
				expect(typeof res.body[ 'worknotesHistory' ]).toBe('object');
				expect(typeof res.body[ 'categories' ]).toBe('object');
				done();
			});
	});
});