const mongoose = require('mongoose');
const request = require('supertest');
const chalk = require('chalk');
const AppForTests = require('../app.js');
const User = require('../../models/user/User');
const Group = require('../../models/group/Group');

let app;

beforeAll(async done => {
	app = await AppForTests();
	done();
});
afterAll(done => mongoose.disconnect().then(() => done()));

describe('GroupMW tests', () => {

	test('Create group', async done => {
		request(app)
			.post('/it/groups/new')
			.send({ name: 'newtestgroup', createdOn: Date.now(), createdBy: 'someAdmin' })
			.then(res => res.body.groupData.group)
			.then(group => {
				expect(group.name).toBe('newtestgroup');
				expect(group.users.length).toBe(0);
				done();
			});
	});
});
