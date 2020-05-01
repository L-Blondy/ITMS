require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const request = require('supertest');
const dashboardRoutes = require('../routes/dashboardRoutes.js');
const ticketRoutes = require('../routes/ticketRoutes.js');

const app = express();

module.exports = async function getAppForTests() {
	app
		.use(cors())
		.use(express.json())
		.use(express.urlencoded({ extended: true }))
		.use('/dashboard', dashboardRoutes)
		.use('/ticket', ticketRoutes);

	try {
		const db = await mongoose
			.set('useNewUrlParser', true)
			.set('useUnifiedTopology', true)
			.set('useFindAndModify', false)
			.set('useCreateIndex', true)
			.connect(process.env.DB_URL_TEST);

		await db.connections[ 0 ].db.dropDatabase();
		await createRecords();
		return app;
	}
	catch (e) {
		console.log(e);
	}
};

const rawINC = {
	id: 'INC0000001',
	description: 'test ticket',
	instructions: 'this is a test ticket',
	status: 'new',
	escalation: 0,
	user: 'test user',
	date: Date.now(),
	urgency: 4,
	impact: 4,
	priority: 'P4',
	category: 'some category',
	subCategory: 'some sub category',
	assignmentGroup: 'some group',
	assignedTo: '',
	onHoldReason: '',
};
const rawREQ = {
	id: 'REQ0000001',
	description: 'test ticket',
	instructions: 'this is a test ticket',
	status: 'new',
	escalation: 0,
	user: 'test user',
	date: Date.now(),
	urgency: 4,
	impact: 4,
	priority: 'P4',
	category: 'some category',
	subCategory: 'some sub category',
	assignmentGroup: 'some group',
	assignedTo: '',
	onHoldReason: '',
};
const rawCHG = {
	id: 'CHG0000001',
	description: 'test ticket',
	instructions: 'this is a test ticket',
	status: 'new',
	escalation: 0,
	user: 'test user',
	date: Date.now(),
	urgency: 4,
	impact: 4,
	priority: 'P4',
	category: 'some category',
	subCategory: 'some sub category',
	assignmentGroup: 'some group',
	assignedTo: '',
	onHoldReason: '',
};

async function createRecords() {
	const res1 = await request(app)
		.post('/ticket/new')
		.send(rawINC);

	const res2 = await request(app)
		.post('/ticket/new')
		.send(rawREQ);

	const res3 = await request(app)
		.post('/ticket/new')
		.send(rawCHG);
}

test('App', done => done());