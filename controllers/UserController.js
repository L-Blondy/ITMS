require('dotenv').config();
const bcrypt = require('bcrypt');
const User = require('../models/user/User');

module.exports = {

	getNewId: async (req, res, next) => {
		try {
			const id = await User.getNewId();
			req.data = id;
			next();
		}
		catch (e) {
			console.log('could not read the "nextID.txt" file', e);
			res.status(500).send('could not read tghe "nextID.txt" file');
		}
	},

	hashPassword: async (req, res, next) => {
		req.body.password = await bcrypt.hash(req.body.password, 10);
		next();
	},

	createNewUser: async (req, res, next) => {
		const userData = req.body;
		req.data = await User.createNewUser(userData);
		next();
	},


};