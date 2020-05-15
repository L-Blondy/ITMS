const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Category = require('../models/Category');
const request = require('supertest');
const AppForTests = require('./app.test.js');
let app;

beforeAll(async done => {
	app = await AppForTests();
	done();
});
afterAll(done => mongoose.disconnect().then(() => done()));

describe('ADMINISTRATE CATEGORIES', () => {

	test('Category.updateFile', async done => {
		const filePath = Category.getFilePath('INC');
		const categories = require(filePath);
		const rand = Math.random();
		categories.test = rand;

		await Category.updateFile(filePath, categories);
		const newCat = require(filePath);
		expect(newCat.test).toBe(rand);
		done();

	});

	test('Administration.updateCategories INCIDENT', async done => {
		const rand = Math.random();
		const categories = require('../data/incCategories.json');
		categories.test = rand;

		request(app)
			.post('/it/administration/INC/categories')
			.send(categories)
			.then(async () => {
				const newCat = require('../data/incCategories.json');
				expect(newCat.test).toBe(rand);

				delete newCat.test;
				await Category.updateFile('../data/incCategories.json', newCat);
				const newCat2 = require('../data/incCategories.json');
				expect(newCat2.test).toBeUndefined();
				done();
			})
			.catch(err => console.log(err));

	});
});
