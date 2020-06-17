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
			.get('/it/administration/users/new')
			.then(res => res.body.administrationData)
			.then(data => {
				id = data.id;
				const { groups } = data;
				expect(id.length).toBe(8);
				expect(id[ 0 ]).toBe('K');
				expect(groups.constructor.name).toBe('Array');
				done();
			});
	});

	test('create new user', async done => {
		const userData = {
			id: id,
			name: 'Laurent Blondy',
			password: 'SomePassword',
			groups: [ 'A1' ],
			createdOn: Date.now(),
			createdBy: 'me'
		};

		request(app)
			.post('/it/administration/users/new')
			.send(userData)
			.then(res => res.body.administrationData)
			.then(user => {
				expect(user.id).toBe(id);
				expect(user.name).toBe('Laurent Blondy');
				expect(user.password).not.toBe('SomePassword');
				expect(user.groups[ 0 ]).toBe('A1');
				expect(user.refreshToken.length).toBeGreaterThan(20);
				expect(user.createdOn).toBeGreaterThan(150000000);
				expect(user.createdBy).toBe('me');
				done();
			});
	});
});

