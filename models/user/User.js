const fs = require('fs');
const path = require('path');
const getnumberLength = require('../../utils/getnumberLength');
const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
	id: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	email: {
		type: String,
	},
	phone: {
		type: String
	},
	createdOn: {
		type: Number,
		required: true
	},
	createdBy: {
		type: String,
		required: true
	},
	refreshToken: {
		type: String
	},
	role: {
		type: String,
		enum: [ 'member', 'admin' ],
		default: 'member'
	}
}, { collation: { locale: 'en', strength: 1 } });

const ID_PREFIX = 'K';
const idFilePath = path.join(__dirname, '../../data/nextID.txt');
const UserModel = model('user', UserSchema);

class User {

	static model = UserModel;
	static schema = UserSchema;

	static async getNewId() {
		const number = JSON.parse(await fs.promises.readFile(idFilePath, 'utf8'));
		const numberLength = getnumberLength(number);
		const id = ID_PREFIX + '0000000'.slice(0, 7 - numberLength) + (number + 1);
		fs.writeFile(idFilePath, number + 1, (err) => { });
		return id;
	}

	static async createNewUser(userData) {
		return await new UserModel(userData).save();
	}

	static async findOne(filters) {
		return await UserModel.findOne(filters);
	}

	static async find(filters) {
		return await UserModel.find(filters);
	}

	static async filter(filter) {
		let results_name = [];
		let results_id = [];
		results_name = await UserModel.find({ name: { $regex: new RegExp(filter.value), $options: 'i' } });
		results_id = await UserModel.find({ id: { $regex: new RegExp(filter.value), $options: 'i' } });
		let results = filter.value ? [ ...results_name, ...results_id ] : results_name;
		return results;
	}
}

module.exports = User;
