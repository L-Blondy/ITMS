require('dotenv').config();
require('./polyfills/String.isOneOf.js');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const chalk = require('chalk');
const userRoutes = require('./routes/userRoutes.js');
const dashboardRoutes = require('./routes/dashboardRoutes.js');
const reportRoutes = require('./routes/reportRoutes.js');
const categoriesRoutes = require('./routes/categoriesRoutes.js');
const ticketRoutes = require('./routes/ticketRoutes.js');

const app = express();

app
	.use(cors())
	.use(express.json())
	.use(express.urlencoded({ extended: true }))
	.use(userRoutes)
	.use('/it/dashboard', dashboardRoutes)
	.use('/it/report', reportRoutes)
	.use('/it/ticket', ticketRoutes)
	.use('/it/administration/categories', categoriesRoutes);

mongoose
	.set('useNewUrlParser', true)
	.set('useUnifiedTopology', true)
	.set('useFindAndModify', false)
	.set('useCreateIndex', true)
	.connect(process.env.DB_URL)
	.then(() => console.log(chalk.bold.blue('# MongoDB Connected !')))
	.catch(err => console.log(err));

app.listen(3000, () => console.log('http://localhost:3000')); 