const Group = require('../models/group/Group');

module.exports = {

	createGroup: async (req, res, next) => {
		if (!req.body.createdOn || !req.body.createdBy)
			return res.status(400).send('createdOn and createdBy are required');
		try {
			req.data.group = await new Group(req.body).save();
			next();
		}
		catch (e) {
			return res.status(500).send(e);
		}
	},

	getAll: async (req, res, next) => {
		req.data.groups = await Group.find({});
		next();
	},

	getSingle: async (req, res, next) => {
		const name = req.params.name;
		req.data.group = await Group.findOne({ name });
		next();
	}
};