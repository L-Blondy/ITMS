const { Schema, model } = require('mongoose');

const FileTestSchema = new Schema({
	name: String,
	data: Buffer,
	mimetype: String
});

const FileTest = model('file', FileTestSchema);

module.exports = FileTest;