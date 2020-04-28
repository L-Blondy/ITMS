const chalk = require('chalk');
const fs = require('fs');
const Incident = require('./Incident');
const Request = require('./Request');
const Change = require('./Change');
let incNumber = fs.readFileSync('./data/incNumber.txt', 'utf8');
let reqNumber = fs.readFileSync('./data/reqNumber.txt', 'utf8');
let chgNumber = fs.readFileSync('./data/chgNumber.txt', 'utf8');
const { log10, ceil } = Math;

module.exports = {

	getModel: function (id) {
		const type = id.slice(0, 3);
		return type === 'INC' ? Incident : type === 'REQ' ? Request : Change;
	},

	getNewId: function (type) {
		const number = type === 'INC' ? ++incNumber : type === 'REQ' ? ++reqNumber : ++chgNumber;
		const numberLength = ceil(log10(number));

		//update ID file
		const fileName = type === 'INC' ? 'incNumber' : type === 'REQ' ? 'reqNumber' : 'chgNumber';
		fs.writeFile(`./data/${ fileName }.txt`, number, (err) => { });

		return type + '0000000'.slice(0, 7 - numberLength) + number;
	},

	validateRaw: function (TicketModel, rawData) {
		const validationError = TicketModel.JoiRawSchema.validate(rawData).error;

		if (validationError) {
			let EM = 'Data sent to the server does not match the requirements:\n';
			validationError.details.forEach(error => {
				EM += '=> ' + error.message + '\n';
			});
			return EM;
		}
		return null;
	},

	addChangeLog: function (data, ticket) {
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

	formatRaw: function (data) {
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

	merge: function (ticket, data) {
		Object.assign(ticket, data, {
			worknotesHistory: [
				...ticket.worknotesHistory,
				...data.worknotesHistory
			]
		});
		return ticket;
	}
};
