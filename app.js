require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const chalk = require('chalk');
const dashboardRoutes = require('./routes/dashboardRoutes.js');
const ticketRoutes = require('./routes/ticketRoutes.js');

const app = express();

app
	.use(cors())
	.use(express.json())
	.use(express.urlencoded({ extended: true }))
	.use('/dashboard', dashboardRoutes)
	.use('/ticket', ticketRoutes);

mongoose
	.set('useNewUrlParser', true)
	.set('useUnifiedTopology', true)
	.set('useFindAndModify', false)
	.connect(process.env.DB_URL)
	.then(() => console.log(chalk.bold.blue('# MongoDB Connected !')))
	.catch(err => console.log(err));

app.listen(3000, () => console.log('http://localhost:3000'));