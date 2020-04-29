const { EventEmitter } = require('events');
const chalk = require('chalk');

class LiveUpdate {
	constructor() {
		this.subscriptions = {};
		this.emitter = new EventEmitter();
		this._init();
	}

	_init() {
		this.emitter.on('data', ({ id, data }) => {
			console.log(data);
			this.subscriptions[ id ].forEach(res => res.send(data));
			delete this.subscriptions[ id ];
			console.log(chalk.cyan('new message emmitted'));
		});
	}

	_unsubscribe(id, res) {
		if (!this.subscriptions[ id ])
			this.subscriptions[ id ] = new Set();
		this.subscriptions[ id ].delete(res);
		console.log(chalk.yellow('Unsubscribed to', id));
	}

	subscribe(req, res) {
		const { id } = req.params;
		const unsubscribeCallback = () => this._unsubscribe(id, res);

		req.connection.once('close', unsubscribeCallback);

		res.connection.once('data', () => {
			req.connection.removeListener('close', unsubscribeCallback);
		});

		if (!this.subscriptions[ id ])
			this.subscriptions[ id ] = new Set();
		this.subscriptions[ id ].add(res);
		console.log(chalk.yellow('Subscribed to', id));
	}

	dispatch(req, res) {
		this.emitter.emit('data', {
			id: req.params.id,
			data: req.body
		});
		res.end();
	}
};
module.exports = new LiveUpdate();
