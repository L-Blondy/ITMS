const mongoose = require('mongoose');
const request = require('supertest');

const AppForTests = require('./AppForTests');
let app;

beforeAll(async done => {
	app = await AppForTests();
	done();
});
afterAll(done => mongoose.disconnect().then(() => done()));

describe('SAVE NEW', () => {

	test('Incident', done => {
		const rawData = {
			id: 'INC0101012',
			description: 'test ticket',
			instructions: 'this is a test ticket',
			status: 'new',
			escalation: 0,
			user: 'test user',
			date: Date.now(),
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
		request(app)
			.post('/ticket/INC/new')
			.send(rawData)
			.then(res => {
				expect('_id' in res.body).toBeTruthy();
				expect(res.body[ 'id' ].startsWith('INC')).toBeTruthy();
				expect(typeof res.body[ 'createdOn' ]).toBe('string');
				expect(res.body[ 'worknotesHistory' ].length).toBe(1);
				expect(res.body[ 'worknotesHistory' ][ 0 ].type).toBe('workLog');
				expect(res.body[ 'worknotesHistory' ][ 0 ].log.length).toBeGreaterThan(0);
				expect(res.body[ 'worknotesHistory' ][ 0 ].date.length).toBeGreaterThan(0);
				expect(res.body[ 'worknotesHistory' ][ 0 ].user.length).toBeGreaterThan(0);
				done();
			});
	});

	test('Request', done => {
		const rawData = {
			id: 'REQ0101012',
			description: 'test ticket',
			instructions: 'this is a test ticket',
			status: 'new',
			escalation: 0,
			user: 'test user',
			date: Date.now(),
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
		request(app)
			.post('/ticket/REQ/new')
			.send(rawData)
			.then(res => {
				expect('_id' in res.body).toBeTruthy();
				expect(res.body[ 'id' ].startsWith('REQ')).toBeTruthy();
				expect(typeof res.body[ 'createdOn' ]).toBe('string');
				expect(res.body[ 'worknotesHistory' ].length).toBe(1);
				expect(res.body[ 'worknotesHistory' ][ 0 ].type).toBe('workLog');
				expect(res.body[ 'worknotesHistory' ][ 0 ].log.length).toBeGreaterThan(0);
				expect(res.body[ 'worknotesHistory' ][ 0 ].date.length).toBeGreaterThan(0);
				expect(res.body[ 'worknotesHistory' ][ 0 ].user.length).toBeGreaterThan(0);
				done();
			});
	});

	test('Change', done => {
		const rawData = {
			id: 'CHG0101012',
			description: 'test ticket',
			instructions: 'this is a test ticket',
			status: 'new',
			escalation: 0,
			user: 'test user',
			date: Date.now(),
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
		request(app)
			.post('/ticket/CHG/new')
			.send(rawData)
			.then(res => {
				expect('_id' in res.body).toBeTruthy();
				expect(res.body[ 'id' ].startsWith('CHG')).toBeTruthy();
				expect(typeof res.body[ 'createdOn' ]).toBe('string');
				expect(res.body[ 'worknotesHistory' ].length).toBe(1);
				expect(res.body[ 'worknotesHistory' ][ 0 ].type).toBe('workLog');
				expect(res.body[ 'worknotesHistory' ][ 0 ].log.length).toBeGreaterThan(0);
				expect(res.body[ 'worknotesHistory' ][ 0 ].date.length).toBeGreaterThan(0);
				expect(res.body[ 'worknotesHistory' ][ 0 ].user.length).toBeGreaterThan(0);
				done();
			});
	});



});
