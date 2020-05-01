const mongoose = require('mongoose');
const request = require('supertest');

const AppForTests = require('./AppForTests');
let app;

beforeAll(async done => {
	app = await AppForTests();
	done();
});
afterAll(done => mongoose.disconnect().then(() => done()));

describe('UPDATE TICKET', () => {


});
