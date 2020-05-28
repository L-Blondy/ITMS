const mongoose = require('mongoose');
const request = require('supertest');
const AppForTests = require('./app.js');
const Ticket = require('../models/ticket/Ticket');
let app;

beforeAll(async done => {
	app = await AppForTests();
	done();
});
afterAll(done => mongoose.disconnect().then(() => done()));

describe('get ticket model', () => {

	test('incidents', async done => {
		request(app)
			.get('/it/report?type=incidents')
			.send()
			.then(res => res.body)
			.then(res => {
				console.log(res);
				done();
			})
			.catch(err => { console.log(err); });
		;
	});
	test('requests', async done => {
		request(app)
			.get('/it/report?type=requests')
			.send()
			.then(res => res.body.reportData)
			.then(res => {
				console.log(res);
				done();
			})
			.catch(err => { console.log(err); });
		;
	});
	test('changes', async done => {
		request(app)
			.get('/it/report?type=changes')
			.send()
			.then(res => res.body.reportData)
			.then(res => {
				console.log(res);
				done();
			})
			.catch(err => { console.log(err); });
		;
	});
});
