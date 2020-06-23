const { Schema, model } = require('mongoose');
const User = require('../user/User');
const roles = require('../../data/groupRoles.json');

const GroupSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	roles: {
		type: [ String ],
		enum: roles,
		required: true
	},
	users: {
		type: [ require('../user/User').schema ],
		default: []
	},
	createdOn: {
		type: Number,
		required: true
	},
	createdBy: {
		type: String,
		required: true
	},
});

GroupSchema.statics.findAllGroupsWithUser = async function (filter) {
	return (await this.find({
		'users': {
			$elemMatch: filter
		}
	})).map(group => group.name);
};

GroupSchema.methods.findUserById = async function (id) {
	return this.users.filter(user => user.id === id)[ 0 ];
};

GroupSchema.methods.findUserByName = async function (name) {
	return this.users.filter(user => user.name === name)[ 0 ];
};

GroupSchema.methods.addUserWithRole = async function (filter, role) {
	const user = await User.model.findOne(filter);
	user.role = role;
	this.users.push(user.toObject());
	return this;
};

GroupSchema.methods.setUserRole = async function (filter, role) {
	let user;
	if (filter.id)
		user = await this.findUserById(filter.id);
	else if (filter.name)
		user = await this.findUserByName(filter.name);
	else
		throw new Error('setUserRole filter needs to be by "id" or by "name" only.');

	user.role = role;
	await this.save();
	return user;
};

const Group = model('group', GroupSchema);

module.exports = Group;