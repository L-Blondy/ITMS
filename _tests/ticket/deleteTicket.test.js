const mongoose = require('mongoose');
const request = require('supertest');
const AppForTests = require('../app.js');
let app;

beforeAll(async done => {
	app = await AppForTests();
	done();
});
afterAll(done => mongoose.disconnect().then(() => done()));

describe('DELETE TICKET', () => {

	test('Incident', async done => {

		request(app)
			.delete('/it/ticket/incidents/INC0000001')
			.send('nothing to send')
			.then(res => {
				const { deletedCount } = res.body;
				expect(deletedCount).toBe(1);
				done();
			})
			.catch(err => console.log(err));
	});

	test('Request', async done => {

		request(app)
			.delete('/it/ticket/requests/REQ0000001')
			.send('nothing to send')
			.then(res => {
				const { deletedCount } = res.body;
				expect(deletedCount).toBe(1);
				done();
			})
			.catch(err => console.log(err));
	});

	test('Change', async done => {

		request(app)
			.delete('/it/ticket/changes/CHG0000001')
			.send('nothing to send')
			.then(res => {
				const { deletedCount } = res.body;
				expect(deletedCount).toBe(1);
				done();
			})
			.catch(err => console.log(err));
	});
});