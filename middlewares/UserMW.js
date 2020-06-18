require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user/User');
const Group = require('../models/group/Group');

module.exports = {

	getNewId: async (req, res, next) => {
		try {
			const id = await User.getNewId();
			req.data = { id };
			next();
		}
		catch (e) {
			console.log('could not read the file "nextID.txt"', e);
			res.status(500).send('could not read tghe "nextID.txt" file');
		}
	},

	getUserGroups: async (req, res, next) => {
		const { id } = req.body;
		try {
			const groups = Group.findAllGroupsWithUser({ id });
			req.data.userGroups = groups || [];
			next();
		}
		catch (e) {
			console.log('Some error occured', e);
			res.status(500).send(e);
		}
	},

	getUser: async (req, res, next) => {
		try {
			req.data = await User.findOne({ id: req.params.id });
			if (!req.data) throw new Error('User not found');
			next();
		}
		catch (e) {
			console.log(e);
			res.status(404).send(e);
		}
	},

	filterUsers: async (req, res, next) => {
		req.data = {};
		try {
			req.data.users = await User.filter(req.query);
			next();
		}
		catch (e) {
			console.log(e);
			res.status(404).send(e);
		}
	},

	hashPassword: async (req, res, next) => {
		req.user.password = await bcrypt.hash(req.user.password, 10);
		next();
	},

	createNewUser: async (req, res, next) => {
		const userData = req.user;
		req.data = await User.createNewUser(userData);
		next();
	},

	validateLogin: async (req, res, next) => {
		const { id, password } = req.body;

		try {
			const dbUser = await User.model.findOne({ id });

			if (!dbUser)
				return res.status(403).send('User not found');
			if (!dbUser.refreshToken)
				return res.status(400).send('Not Allowed');

			const hashedPassword = dbUser.password;
			const isCorrectPwd = await bcrypt.compare(password, hashedPassword);

			if (!isCorrectPwd)
				return res.status(403).send('Incorrect username or password');

			req.user = dbUser.toObject();
			next();
		}
		catch (e) {
			console.log(e);
			res.status(500).send('Some error has occured');
		}
	},

	assignAccessToken: async (req, res, next) => {
		const { id, role } = req.user;
		const accessToken = jwt.sign({ id, role }, process.env.ACCESS_TOKEN, { expiresIn: '10s' });
		req.user.accessToken = accessToken;
		next();
	},

	assignRefreshToken: async (req, res, next) => {
		const { id, role } = req.user;
		const refreshToken = jwt.sign({ id, role }, process.env.ACCESS_TOKEN);
		req.user.refreshToken = refreshToken;
		next();
	},

};