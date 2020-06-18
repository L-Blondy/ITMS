const mongoose = require('mongoose');
const request = require('supertest');
const chalk = require('chalk');
const AppForTests = require('../app.js');
const User = require('../../models/user/User');
const Group = require('../../models/group/Group');

let app;

beforeAll(async done => {
	app = await AppForTests();
	await User.createNewUser({
		id: 'K0592997',
		name: 'Laurent Blondy',
		password: 'dummypwd',
		refreshToken: 'some refresh Token here was assigned to the user',
		createdOn: Date.now(),
		createdBy: 'me',
		email: 'laurentblondy@gmail.com',
		phone: '0671597928'
	});
	done();
});
afterAll(done => mongoose.disconnect().then(() => done()));

describe('groupDB tests', () => {

	test('create group', async done => {
		const group1 = await new Group({ name: 'mytestgroup1' }).save();
		expect(group1.name).toBe('mytestgroup1');
		expect(group1.users.constructor.name).toBe('CoreDocumentArray');

		const group2 = await new Group({ name: 'mytestgroup2' }).save();
		expect(group2.name).toBe('mytestgroup2');
		expect(group2.users.constructor.name).toBe('CoreDocumentArray');
		done();
	});

	test('add user', async done => {

		const group1 = await Group.findOne({ name: 'mytestgroup1' });
		await group1.addUserWithRole({ id: 'K0592997' }, 'admin');
		await group1.save();

		const group2 = await Group.findOne({ name: 'mytestgroup2' });
		await group2.addUserWithRole({ id: 'K0592997' }, 'member');
		await group2.save();

		expect(group1.users[ 0 ].name).toBe('Laurent Blondy');
		expect(group1.users[ 0 ].role).toBe('admin');

		expect(group2.users[ 0 ].name).toBe('Laurent Blondy');
		expect(group2.users[ 0 ].role).toBe('member');

		done();
	});

	test('change role', async done => {
		const group1 = await Group.findOne({ name: 'mytestgroup1' });
		const group2 = await Group.findOne({ name: 'mytestgroup2' });

		const user1 = await group1.setUserRole({ name: 'Laurent Blondy' }, 'member');
		const user2 = await group2.setUserRole({ id: 'K0592997' }, 'admin');
		expect(user1.role).toBe('member');
		expect(user2.role).toBe('admin');
		done();
	});

	test('find all user groups', async done => {
		const groups = await Group.findAllUserGroupNames({ name: 'Laurent Blondy' });

		expect(groups[ 0 ]).toBe('mytestgroup1');
		expect(groups[ 1 ]).toBe('mytestgroup2');

		done();
	});
});