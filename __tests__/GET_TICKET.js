const mongoose = require('mongoose');
const request = require('supertest');

const AppForTests = require('./AppForTests');
let app;

beforeAll(async done => {
	app = await AppForTests();
	done();
});
afterAll(done => mongoose.disconnect().then(() => done()));

describe('GET TICKET', () => {

	test('Incident', async done => {
		request(app)
			.get('/ticket/INC0000001')
			.then(res => {
				console.log(res.body);
				expect(res.body[ 'id' ].startsWith('INC')).toBeTruthy();
				expect('_id' in res.body).toBeTruthy();
				expect(typeof res.body[ 'createdOn' ]).toBe('string');
				expect(res.body[ 'worknotesHistory' ].length).toBe(1);
				expect(res.body[ 'worknotesHistory' ][ 0 ].type).toBe('workLog');
				expect(res.body[ 'worknotesHistory' ][ 0 ].log.length).toBeGreaterThan(0);
				expect(res.body[ 'worknotesHistory' ][ 0 ].date.length).toBeGreaterThan(0);
				expect(res.body[ 'worknotesHistory' ][ 0 ].user.length).toBeGreaterThan(0);
				expect(typeof res.body[ 'staticData' ].category).toBe('object');
				expect(typeof res.body[ 'staticData' ].subCategory).toBe('object');
				done();
			});
	});

	test('Request', async done => {
		request(app)
			.get('/ticket/REQ0000001')
			.then(res => {
				expect(res.body[ 'id' ].startsWith('REQ')).toBeTruthy();
				expect('_id' in res.body).toBeTruthy();
				expect(typeof res.body[ 'createdOn' ]).toBe('string');
				expect(res.body[ 'worknotesHistory' ].length).toBe(1);
				expect(res.body[ 'worknotesHistory' ][ 0 ].type).toBe('workLog');
				expect(res.body[ 'worknotesHistory' ][ 0 ].log.length).toBeGreaterThan(0);
				expect(res.body[ 'worknotesHistory' ][ 0 ].date.length).toBeGreaterThan(0);
				expect(res.body[ 'worknotesHistory' ][ 0 ].user.length).toBeGreaterThan(0);
				expect(typeof res.body[ 'staticData' ].category).toBe('object');
				expect(typeof res.body[ 'staticData' ].subCategory).toBe('object');
				done();
			});
	});

	test('Change', async done => {
		request(app)
			.get('/ticket/CHG0000001')
			.then(res => {
				expect(res.body[ 'id' ].startsWith('CHG')).toBeTruthy();
				expect('_id' in res.body).toBeTruthy();
				expect(typeof res.body[ 'createdOn' ]).toBe('string');
				expect(res.body[ 'worknotesHistory' ].length).toBe(1);
				expect(res.body[ 'worknotesHistory' ][ 0 ].type).toBe('workLog');
				expect(res.body[ 'worknotesHistory' ][ 0 ].log.length).toBeGreaterThan(0);
				expect(res.body[ 'worknotesHistory' ][ 0 ].date.length).toBeGreaterThan(0);
				expect(res.body[ 'worknotesHistory' ][ 0 ].user.length).toBeGreaterThan(0);
				expect(typeof res.body[ 'staticData' ].category).toBe('object');
				expect(typeof res.body[ 'staticData' ].subCategory).toBe('object');
				done();
			});
	});

});
