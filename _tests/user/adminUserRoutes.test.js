const mongoose = require('mongoose');
const request = require('supertest');
const AppForTests = require('../app.js');
let app, id;

beforeAll(async done => {
	app = await AppForTests();
	done();
});
afterAll(done => mongoose.disconnect().then(() => done()));

describe('USER TESTS', () => {

	test('get new ID', done => {
		request(app)
			.get('/it/administration/user/new')
			.then(res => res.body.administrationData)
			.then(data => {
				id = data;
				expect(id.length).toBe(8);
				expect(id[ 0 ]).toBe('K');
				done();
			});
	});

	test('create new user', async done => {
		const userData = {
			id: id,
			name: 'Laurent Blondy',
			password: 'SomePassword',
			role: 'A1'
		};

		request(app)
			.post('/it/administration/user/new')
			.send(userData)
			.then(res => res.body.administrationData)
			.then(user => {
				expect(user.id).toBe(id);
				expect(user.name).toBe('Laurent Blondy');
				expect(user.password).not.toBe('SomePassword');
				expect(user.role).toBe('A1');
				expect(user.refreshToken.length).toBeGreaterThan(20);
				done();
			});
	});
});

