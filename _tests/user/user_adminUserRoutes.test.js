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
			.get('/it/users/new')
			.then(res => res.body)
			.then(data => {
				id = data.id;
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
			createdOn: Date.now(),
			createdBy: 'me',
			email: 'laurentblondy@gmail.com',
			phone: '0671597928'
		};

		request(app)
			.post('/it/users/new')
			.send(userData)
			.then(res => res.body)
			.then(user => {
				expect(user.id).toBe(id);
				expect(user.name).toBe('Laurent Blondy');
				expect(user.password).not.toBe('SomePassword');
				expect(user.email).toBe('laurentblondy@gmail.com');
				expect(user.phone).toBe('0671597928');
				expect(user.refreshToken.length).toBeGreaterThan(20);
				expect(user.createdOn).toBeGreaterThan(150000000);
				expect(user.createdBy).toBe('me');
				done();
			});
	});
});

