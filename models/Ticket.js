const chalk = require('chalk');
const fs = require('fs');
const { log10, ceil } = Math;
const Incident = require('./Incident');
const Request = require('./Request');
const Change = require('./Change');
let incNumber = fs.readFileSync('./data/incNumber.txt', 'utf8');
let reqNumber = fs.readFileSync('./data/reqNumber.txt', 'utf8');
let chgNumber = fs.readFileSync('./data/chgNumber.txt', 'utf8');

function _updateIdFile(type, number) {
	const fileName = type === 'INC' ? 'incNumber' : type === 'REQ' ? 'reqNumber' : 'chgNumber';
	fs.writeFile(`./data/${ fileName }.txt`, number, (err) => { });
}

function _getTicketModel(id) {
	const type = id.slice(0, 3);
	return type === 'INC' ? Incident : type === 'REQ' ? Request : Change;
}

module.exports = {

	getNewTicketId(type) {
		const number = type === 'INC' ? ++incNumber : type === 'REQ' ? ++reqNumber : ++chgNumber;
		const numberLength = ceil(log10(number));
		_updateIdFile(type, number);
		return type + '0000000'.slice(0, 7 - numberLength) + number;
	},

	getBlankTicket(id) {
		const TicketModel = _getTicketModel(id);
		return TicketModel.blankTicket(id);
	},

	validateRawData(data) {
		const TicketModel = _getTicketModel(data.id);
		const schemaError = TicketModel.JoiRawSchema.validate(data).error;
		if (schemaError) {
			console.log('data', data);
			console.error(schemaError.details);
			throw new Error('Schema error, Invalid data');
		}
	},

	format(data) {
		const { log, date, user, changeLog, ...rest } = data;

		const changeNotes = {
			type: 'changeLog',
			log: changeLog,
			date,
			user
		};
		const workNotes = {
			type: 'workLog',
			log,
			date,
			user
		};

		const worknotesHistory = [];
		changeLog && worknotesHistory.push(changeNotes);
		log && worknotesHistory.push(workNotes);

		const formatted = {
			...rest,
			worknotesHistory
		};
		return formatted;
	},

	async createNew(data) {
		const TicketModel = _getTicketModel(data.id);
		return await new TicketModel(data).save();
	},

	async save(ticket) {
		return await ticket.save();
	},

	async findById(id) {
		const TicketModel = _getTicketModel(id);
		return await TicketModel.findOne({ id }).lean().populate();
	},

	addChangeLog(ticket, data) {
		let changeLog = '';

		for (let prop in data) {
			//props to ignore
			if (prop === 'log' || prop === 'date' || prop === 'user' || prop[ 0 ] === '_') continue;

			const dataVal = data[ prop ];
			const ticketVal = ticket[ prop ];

			if (dataVal != ticketVal) {
				changeLog += `${ prop } field was updated from ${ ticketVal } to ${ dataVal }\n`;
			}
		}
		data.changeLog = changeLog;
		return data;
	},

	merge(ticket, data) {

		Object.assign(ticket, data, {
			worknotesHistory: [
				...ticket.worknotesHistory,
				...data.worknotesHistory
			]
		});
		return ticket;
	},
};