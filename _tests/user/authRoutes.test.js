const mongoose = require('mongoose');
const request = require('supertest');
const chalk = require('chalk');
const bcrypt = require('bcrypt');
const AppForTests = require('../app.js');
const User = require('../../models/user/User');
const jwt = require('jsonwebtoken');

let app;
const refreshToken = jwt.sign({ id: 'K0592997', role: 'A1' }, process.env.ACCESS_TOKEN);

beforeAll(async done => {
	app = await AppForTests();
	await User.createNewUser({
		id: 'K0592997',
		name: 'Laurent Blondy',
		password: await bcrypt.hash('SomePassword', 10),
		refreshToken,
		createdOn: Date.now(),
		createdBy: 'me',
		email: 'laurentblondy@gmail.com',
		phone: '0671597928'
	});
	done();
});
afterAll(done => mongoose.disconnect().then(() => done()));

describe('authRoutes Login', () => {

	test('login successfull', async done => {

		request(app)
			.post('/login')
			.send({ id: 'K0592997', password: 'SomePassword' })
			.then(res => {
				if (res.status >= 400) throw new Error(`${ res.status }: Some error occured`);
				return res.body.user;
			})
			.then(user => {
				expect(user.id).toBe('K0592997');
				expect(user.name).toBe('Laurent Blondy');
				expect(user.email).toBe('laurentblondy@gmail.com');
				expect(user.phone).toBe('0671597928');
				expect(user.accessToken.length).toBeGreaterThan(20);
				expect(user.refreshToken.length).toBeGreaterThan(20);
				expect(user.createdBy).toBe('me');
				done();
			});
	});

	test('login failed', async done => {

		request(app)
			.post('/login')
			.send({ id: 'K0592997', password: 'SomePassword111' })
			.then(res => {
				expect(res.status).toBe(403);
				done();
			})
			.catch(err => {
				console.log(err);
				done();
			});

		request(app)
			.post('/login')
			.send({ id: 'K059299777', password: 'SomePassword' })
			.then(res => {
				expect(res.status).toBe(403);
				done();
			})
			.catch(err => {
				console.log(err);
				done();
			});
	});
});