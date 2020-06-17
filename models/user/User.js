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
	groups: {
		type: [ String ],
		enum: [ 'A1', 'A2', 'A3' ]
	},
	password: {
		type: String,
		required: true
	},

	createdOn: {
		type: Number,
		required: true
	},
	createdBy: {
		type: String,
		required: true
	},
	refreshToken: String,
});

const ID_PREFIX = 'K';
const idFilePath = path.join(__dirname, '../../data/nextID.txt');
const UserModel = model('user', UserSchema);

class User {

	static model = UserModel;

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
}

module.exports = User;