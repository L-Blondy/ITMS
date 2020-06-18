const Group = require('../models/group/Group');

module.exports = {

	createGroup: async (req, res, next) => {
		const { name } = req.body;
		req.data.group = await new Group({ name }).save();
		next();
	}
};