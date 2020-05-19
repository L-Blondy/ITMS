const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Category = require('../models/administration/Category');
const request = require('supertest');
const AppForTests = require('./app.js');
let app;

beforeAll(async done => {
	app = await AppForTests();
	done();
});
afterAll(done => mongoose.disconnect().then(() => done()));

describe('ADMINISTRATE CATEGORIES', () => {

	test('Category.updateFile', async done => {
		const filePath = Category.getFilePath('incidents');
		const categories = await Category.getData(filePath);
		const rand = Math.random();
		categories.test = rand;

		await Category.updateFile(filePath, categories);
		const newCat = await Category.getData(filePath);
		expect(newCat.test).toBe(rand);
		done();

	});

	test('Administration.updateCategories INCIDENT', async done => {
		const rand = Math.random();
		const filePath = Category.getFilePath('incidents');
		const categories = await Category.getData(filePath);
		categories.test = rand;

		request(app)
			.post('/it/administration/incidents/categories')
			.send(categories)
			.then(async () => {
				const newCat = await Category.getData(filePath);
				expect(newCat.test).toBe(rand);

				delete newCat.test;
				await Category.updateFile(filePath, newCat);
				const newCat2 = await Category.getData(filePath);
				expect(newCat2.test).toBeUndefined();
				done();
			})
			.catch(err => console.log(err));

	});
});
