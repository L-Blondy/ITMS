const chalk = require('chalk');
const fs = require('fs');
const Incident = require('./Incident');
const Request = require('./Request');
const Change = require('./Change');
const StaticData = require('./StaticData');
let incNumber = fs.readFileSync('./data/incNumber.txt', 'utf8');
let reqNumber = fs.readFileSync('./data/reqNumber.txt', 'utf8');
let chgNumber = fs.readFileSync('./data/chgNumber.txt', 'utf8');
const { log10, ceil } = Math;

class Ticket {

	constructor({ id, type, data } = {}) {
		if (!id && !type && !data) throw new Error('"Ticket" constructor should not be empty: constructor({ id, type, data }) ');
		this.data = data;
		this.id = id || this.data && this.data.id;
		this.type = type || this.id && this.id.slice(0, 3) || this.data && this.data.id.slice(0, 3);
		this.model = this._setModel();
	}

	_setModel() {
		switch (this.type) {
			case 'INC':
				return Incident;
			case 'REQ':
				return Request;
			case 'CHG':
				return Change;
			default: throw new Error('No "type" was found, "type" is required to get a "model".\nPlease set it in the constructor.');
		}
	}

	_setNewId() {
		let fileName, number;

		switch (this.type) {
			case 'INC':
				fileName = 'incNumber';
				number = ++incNumber;
				break;
			case 'REQ':
				fileName = 'reqNumber';
				number = ++reqNumber;
				break;
			case 'CHG':
				fileName = 'chgNumber';
				number = ++chgNumber;
				break;
			default: throw new InternalError('No Ticket.type could be found');
		}
		fs.writeFile(`./data/${ fileName }.txt`, number, (err) => { });
		this.id = this.type + '0000000'.slice(0, 7 - ceil(log10(number))) + number;
	}

	get blankTicket() {
		this._setNewId();
		return this.model.blankTicket(this.id);
	}

	async addCreationLog() {
		this.data.log = this.data.id + ' created with success.';
		return this;
	}

	async addCreatedOn() {
		this.data.createdOn = this.data.date;
		return this;
	}

	async validateRawData() {
		const error = this.model.JoiRawSchema.validate(this.data).error;
		console.log(this.data);
		if (error) {
			throw new Error(error.details[ 0 ].message);
		}
		return this;
	}

	async formatData() {
		const { log, date, user, changeLog, ...rest } = this.data;


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
		this.data = formatted;

		return this;
	}

	async newRecord() {
		this.record = await new this.model(this.data).save();
		return this;
	};

	async findRecord() {
		this.record = await this.model.findOne({ id: this.id });
		return this;
	}

	async setStaticData() {
		const allStaticData = await StaticData.findOne({});
		this.staticData = allStaticData[ this.type ];
		return this;
	}

	async addChangeLog() {
		let changeLog = '';
		const { data, record } = this;
		if (!data) throw new Error('No "data" property was found, please set if in the constructor');
		if (!record) throw new Error('Please use "findRecord" before "addChangeLog"');

		for (let prop in data) {
			//props to ignore
			if (prop === 'log'
				|| prop === 'date'
				|| prop === 'createdOn'
				|| prop === 'user'
				|| prop[ 0 ] === '_'
				|| prop === 'staticData') continue;;

			const dataVal = data[ prop ];
			const recordVal = record[ prop ];

			if (dataVal != recordVal) {
				changeLog += `/${ prop }/ from /${ recordVal }/ to /${ dataVal }/ \n`;
			}
		}
		data.changeLog = changeLog;
		return this;
	}

	async updateRecord() {
		if (this.data.user) throw new Error('Please use "formatData" before "updateRecord"');
		delete this.data.__v;
		Object.assign(this.record, this.data, {
			worknotesHistory: [
				...this.record.worknotesHistory,
				...this.data.worknotesHistory
			]
		});
		await this.record.save();
		return this;
	}

	async saveFileLog(file, user) {
		if (!file || !user)
			throw new Error('Both "user" and "file" are required arguments for "Ticket.saveFile"');
		file.data = 'test';

		const fileLog = {
			type: 'fileLog',
			date: Date.now(),
			user,
			file
		};
		this.record.worknotesHistory.push(fileLog);
		await this.record.save();
	}
}


module.exports = Ticket;