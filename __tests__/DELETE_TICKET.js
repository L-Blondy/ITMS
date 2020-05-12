const mongoose = require('mongoose');
const request = require('supertest');

const AppForTests = require('./AppForTests');
let app;

beforeAll(async done => {
	app = await AppForTests();
	done();
});
afterAll(done => mongoose.disconnect().then(() => done()));

describe('DELETE TICKET', () => {

	test('Incident', async done => {

		request(app)
			.delete('/ticket/INC/INC0000001')
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
			.delete('/ticket/REQ/REQ0000001')
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
			.delete('/ticket/CHG/CHG0000001')
			.send('nothing to send')
			.then(res => {
				const { deletedCount } = res.body;
				expect(deletedCount).toBe(1);
				done();
			})
			.catch(err => console.log(err));
	});
});