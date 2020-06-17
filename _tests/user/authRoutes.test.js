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
		role: 'A1',
		refreshToken
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
				return res.body;
			})
			.then(res => {
				expect(res.user.id).toBe('K0592997');
				expect(res.user.name).toBe('Laurent Blondy');
				expect(res.user.role).toBe('A1');
				expect(res.user.accessToken.length).toBeGreaterThan(20);
				expect(res.user.refreshToken.length).toBeGreaterThan(20);
				done();
			})
			.catch(err => {
				console.log(chalk.red(err));
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